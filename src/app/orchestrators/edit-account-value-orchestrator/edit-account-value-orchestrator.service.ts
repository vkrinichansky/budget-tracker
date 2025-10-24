import { Injectable } from '@angular/core';
import {
  Account,
  AccountEvents,
  AccountFacadeService,
  EditAccountValueEvent,
} from '@budget-tracker/account';
import { BatchOperationService, DomainEvent, EventBusService } from '@budget-tracker/shared-utils';
import { firstValueFrom } from 'rxjs';
import {
  Category,
  CategoryFacadeService,
  expenseAdjustmentCategory,
  incomeAdjustmentCategory,
} from '@budget-tracker/category';
import {
  CategoryValueChangeRecord,
  createCategoryValueChangeRecord,
  ActivityLogFacadeService,
} from '@budget-tracker/activity-log';
import { BaseOrchestratorService } from '@budget-tracker/orchestrators-utils';

@Injectable()
export class EditAccountValueOrchestratorService extends BaseOrchestratorService {
  constructor(
    private readonly accountFacade: AccountFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    eventBusService: EventBusService,
    batchOperationService: BatchOperationService
  ) {
    super(eventBusService, batchOperationService);
  }

  listen(): void {
    this.handleEvent<EditAccountValueEvent>(AccountEvents.EDIT_ACCOUNT_VALUE_START);
  }

  protected async eventCallback(event: DomainEvent<EditAccountValueEvent>): Promise<void> {
    try {
      const account = await firstValueFrom(
        this.accountFacade.getAccountById(event.payload.accountId)
      );

      const delta = event.payload.value - account.value;
      const absDelta = Math.abs(delta);

      let categoryToUse: Category;

      if (delta > 0) {
        categoryToUse = await firstValueFrom(
          this.categoryFacade.getCategoryById(incomeAdjustmentCategory.id)
        );
      } else {
        categoryToUse = await firstValueFrom(
          this.categoryFacade.getCategoryById(expenseAdjustmentCategory.id)
        );
      }

      const categoryValueChangeRecord: CategoryValueChangeRecord = createCategoryValueChangeRecord(
        categoryToUse,
        account,
        absDelta,
        absDelta,
        account.currency,
        categoryToUse.budgetType,
        event.payload.note
      );

      await this.batchOperationService.executeBatchOperation([
        {
          docRef: this.accountFacade.getAccountDocRef(),
          type: 'update',
          data: { [`${account.id}.value`]: event.payload.value },
        },
        {
          docRef: this.categoryFacade.getCategoryDocRef(),
          type: 'update',
          data: { [`${categoryToUse.id}.value`]: categoryToUse.value + absDelta },
        },
        {
          docRef: this.activityLogFacade.getActivityLogDocRef(),
          type: 'update',
          data: { [categoryValueChangeRecord.id]: categoryValueChangeRecord },
        },
      ]);

      this.accountFacade.updateAccounts([
        {
          id: account.id,
          value: event.payload.value,
        } as Account,
      ]);

      this.categoryFacade.updateCategories([
        {
          ...categoryToUse,
          value: categoryToUse.value + absDelta,
        } as Category,
      ]);

      this.activityLogFacade.addRecord(categoryValueChangeRecord);

      this.eventBusService.emit({
        type: AccountEvents.EDIT_ACCOUNT_VALUE_FINISH,
        status: 'success',
      });
    } catch {
      this.eventBusService.emit({
        type: AccountEvents.EDIT_ACCOUNT_VALUE_FINISH,
        status: 'error',
        errorCode: 'errors.account.editAccountValueFlowFailed',
      });
    }
  }
}
