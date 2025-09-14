import { Injectable } from '@angular/core';
import {
  Account,
  AccountEvents,
  AccountFacadeService,
  EditAccountValueEvent,
} from '@budget-tracker/account';
import { BatchOperationService, EventBusService } from '@budget-tracker/utils';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
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

@Injectable()
export class EditAccountValueOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly accountFacade: AccountFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly batchOperationService: BatchOperationService
  ) {}

  listen(): void {
    this.eventBusService
      .on<EditAccountValueEvent>(AccountEvents.EDIT_ACCOUNT_VALUE_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
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

          const categoryValueChangeRecord: CategoryValueChangeRecord =
            createCategoryValueChangeRecord(
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
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
