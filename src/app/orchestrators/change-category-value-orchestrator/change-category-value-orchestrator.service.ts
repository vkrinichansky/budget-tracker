import { Injectable } from '@angular/core';
import {
  CategoryEvents,
  CategoryFacadeService,
  ChangeCategoryValueEvent,
} from '@budget-tracker/category';
import { AccountFacadeService } from '@budget-tracker/account';
import {
  ActivityLogFacadeService,
  CategoryValueChangeRecord,
  createCategoryValueChangeRecord,
} from '@budget-tracker/activity-log';
import { BudgetType } from '@budget-tracker/models';
import { EventBusService, getErrorMessage, pick } from '@budget-tracker/utils';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

@Injectable()
export class ChangeCategoryValueOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService
  ) {}

  listen(): void {
    this.eventBusService
      .on<ChangeCategoryValueEvent>(CategoryEvents.CHANGE_CATEGORY_VALUE_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          await this.categoryFacade.changeCategoryValue(
            event.payload.categoryId,
            event.payload.convertedValueToAdd
          );

          const category = await firstValueFrom(
            this.categoryFacade.getCategoryById(event.payload.categoryId)
          );

          const account = await firstValueFrom(
            this.accountFacade.getAccountById(event.payload.accountId)
          );

          let updatedAccountValue: number;

          switch (category.budgetType) {
            case BudgetType.Income:
              updatedAccountValue = account.value + event.payload.valueToAdd;

              break;

            case BudgetType.Expense:
              updatedAccountValue = account.value - event.payload.valueToAdd;

              break;
          }

          await this.accountFacade.changeAccountValue(event.payload.accountId, updatedAccountValue);

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

          await this.activityLogFacade.addRecord(changeCategoryValueRecord);

          this.eventBusService.emit({
            type: CategoryEvents.CHANGE_CATEGORY_VALUE_FINISH,
            status: 'success',
          });
        } catch (error) {
          this.eventBusService.emit({
            type: CategoryEvents.CHANGE_CATEGORY_VALUE_FINISH,
            status: 'error',
            errorCode: getErrorMessage(error),
          });
        }
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
