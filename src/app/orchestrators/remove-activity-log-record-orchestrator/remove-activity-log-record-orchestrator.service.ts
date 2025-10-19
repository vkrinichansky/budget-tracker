import { Injectable } from '@angular/core';
import {
  ActivityLogEvents,
  RemoveCategoryValueChangeRecordEvent,
  ActivityLogFacadeService,
  CategoryValueChangeRecord,
} from '@budget-tracker/activity-log';
import { Category, CategoryFacadeService } from '@budget-tracker/category';
import { Account, AccountFacadeService } from '@budget-tracker/account';
import { BudgetType } from '@budget-tracker/shared-models';
import { BatchOperationService, DomainEvent, EventBusService } from '@budget-tracker/shared-utils';
import { firstValueFrom } from 'rxjs';
import { deleteField } from '@angular/fire/firestore';
import { BaseOrchestratorService } from '../base-orchestrator.service';

@Injectable()
export class RemoveActivityLogRecordOrchestratorService extends BaseOrchestratorService {
  constructor(
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    eventBusService: EventBusService,
    batchOperationService: BatchOperationService
  ) {
    super(eventBusService, batchOperationService);
  }

  listen(): void {
    this.handleEvent<RemoveCategoryValueChangeRecordEvent>(
      ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_START
    );
  }

  protected async eventCallback(
    event: DomainEvent<RemoveCategoryValueChangeRecordEvent>
  ): Promise<void> {
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
          updatedAccountValue = account.value - record.value < 0 ? 0 : account.value - record.value;

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

      this.eventBusService.emit({
        type: ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH,
        status: 'success',
        operationId: event.payload.recordId,
      });
    } catch (error) {
      this.eventBusService.emit({
        type: ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH,
        status: 'error',
        operationId: event.payload.recordId,
        errorCode: 'errors.activityLog.removeRecordFlowFailed',
      });
    }
  }
}
