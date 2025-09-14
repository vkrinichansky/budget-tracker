import { Injectable } from '@angular/core';
import {
  ActivityLogEvents,
  RemoveCategoryValueChangeRecordEvent,
  ActivityLogFacadeService,
  CategoryValueChangeRecord,
} from '@budget-tracker/activity-log';
import { Category, CategoryFacadeService } from '@budget-tracker/category';
import { Account, AccountFacadeService } from '@budget-tracker/account';
import { BudgetType } from '@budget-tracker/models';
import { BatchOperationService, EventBusService } from '@budget-tracker/utils';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { deleteField } from '@angular/fire/firestore';

@Injectable()
export class RemoveActivityLogRecordOrchestratorService {
  private readonly destroy$ = new Subject<void>();
  constructor(
    private readonly eventBus: EventBusService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly batchOperationService: BatchOperationService
  ) {}

  listen(): void {
    this.eventBus
      .on<RemoveCategoryValueChangeRecordEvent>(
        ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_START
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          const record = (await firstValueFrom(
            this.activityLogFacade.getRecordById(event.payload.recordId)
          )) as CategoryValueChangeRecord;

          const category = structuredClone(
            await firstValueFrom(this.categoryFacade.getCategoryById(record.category.id))
          );

          const account = structuredClone(
            await firstValueFrom(this.accountFacade.getAccountById(record.account.id))
          );

          const updatedCategoryValue =
            category.value - record.convertedValue < 0 ? 0 : category.value - record.convertedValue;

          let updatedAccountValue: number;

          switch (record.budgetType) {
            case BudgetType.Income:
              updatedAccountValue =
                account.value - record.value < 0 ? 0 : account.value - record.value;

              break;

            case BudgetType.Expense:
              updatedAccountValue = account.value + record.value;

              break;
          }

          await this.batchOperationService.executeBatchOperation([
            {
              docRef: this.accountFacade.getAccountDocRef(),
              type: 'update',
              data: { [`${account.id}.value`]: updatedAccountValue },
            },
            {
              docRef: this.categoryFacade.getCategoryDocRef(),
              type: 'update',
              data: { [`${category.id}.value`]: updatedCategoryValue },
            },
            {
              docRef: this.activityLogFacade.getActivityLogDocRef(),
              type: 'update',
              data: { [record.id]: deleteField() },
            },
          ]);

          this.categoryFacade.updateCategories([
            {
              ...category,
              value: updatedCategoryValue,
            } as Category,
          ]);

          this.accountFacade.updateAccounts([
            {
              id: account.id,
              value: updatedAccountValue,
            } as Account,
          ]);

          this.activityLogFacade.removeRecord(event.payload.recordId);

          this.eventBus.emit({
            type: ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH,
            status: 'success',
            operationId: event.payload.recordId,
          });
        } catch (error) {
          this.eventBus.emit({
            type: ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH,
            status: 'error',
            operationId: event.payload.recordId,
            errorCode: 'errors.activityLog.removeRecordFlowFailed',
          });
        }
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
