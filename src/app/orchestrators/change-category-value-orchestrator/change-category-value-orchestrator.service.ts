import { Injectable } from '@angular/core';
import {
  CategoryEvents,
  CategoryFacadeService,
  ChangeCategoryValueEvent,
  Category,
} from '@budget-tracker/category';
import { Account, AccountFacadeService } from '@budget-tracker/account';
import {
  ActivityLogFacadeService,
  CategoryValueChangeRecord,
  createCategoryValueChangeRecord,
} from '@budget-tracker/activity-log';
import { BudgetType } from '@budget-tracker/models';
import { BatchOperationService, EventBusService, pick } from '@budget-tracker/utils';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

@Injectable()
export class ChangeCategoryValueOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly batchOperationService: BatchOperationService
  ) {}

  listen(): void {
    this.eventBusService
      .on<ChangeCategoryValueEvent>(CategoryEvents.CHANGE_CATEGORY_VALUE_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          const category = await firstValueFrom(
            this.categoryFacade.getCategoryById(event.payload.categoryId)
          );

          const account = await firstValueFrom(
            this.accountFacade.getAccountById(event.payload.accountId)
          );

          const updatedCategoryValue = category.value + event.payload.convertedValueToAdd;

          let updatedAccountValue: number;

          switch (category.budgetType) {
            case BudgetType.Income:
              updatedAccountValue = account.value + event.payload.valueToAdd;

              break;

            case BudgetType.Expense:
              updatedAccountValue = account.value - event.payload.valueToAdd;

              break;
          }

          const changeCategoryValueRecord: CategoryValueChangeRecord =
            createCategoryValueChangeRecord(
              pick(category, ['id', 'name', 'icon', 'isSystem']),
              pick(account, ['id', 'name', 'currency']),
              event.payload.valueToAdd,
              event.payload.convertedValueToAdd,
              account.currency,
              category.budgetType,
              event.payload.note
            );

          await this.batchOperationService.executeBatchOperation([
            {
              docRef: this.accountFacade.getAccountDocRef(),
              type: 'update',
              data: { [`${account.id}.value`]: updatedAccountValue },
            },
            {
              docRef: this.categoryFacade.getCategoryDocRef(),
              type: 'update',
              data: {
                [`${category.id}.value`]: updatedCategoryValue,
              },
            },
            {
              docRef: this.activityLogFacade.getActivityLogDocRef(),
              type: 'update',
              data: { [changeCategoryValueRecord.id]: changeCategoryValueRecord },
            },
          ]);

          this.accountFacade.updateAccounts([
            {
              id: account.id,
              value: updatedAccountValue,
            } as Account,
          ]);

          this.categoryFacade.changeCategoryValue({
            ...category,
            value: updatedCategoryValue,
          } as Category);

          this.activityLogFacade.addRecord(changeCategoryValueRecord);

          this.eventBusService.emit({
            type: CategoryEvents.CHANGE_CATEGORY_VALUE_FINISH,
            status: 'success',
          });
        } catch {
          this.eventBusService.emit({
            type: CategoryEvents.CHANGE_CATEGORY_VALUE_FINISH,
            status: 'error',
            errorCode: 'errors.category.changeCategoryValueFlowFailed',
          });
        }
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
