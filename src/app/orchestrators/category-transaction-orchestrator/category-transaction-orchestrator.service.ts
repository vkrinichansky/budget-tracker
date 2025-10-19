import { Injectable } from '@angular/core';
import {
  CategoryEvents,
  CategoryFacadeService,
  Category,
  OpenCategoryTransactionModalEvent,
} from '@budget-tracker/category';
import { Account, AccountFacadeService } from '@budget-tracker/account';
import {
  ActivityLogFacadeService,
  CategoryValueChangeRecord,
  createCategoryValueChangeRecord,
} from '@budget-tracker/activity-log';
import { BudgetType } from '@budget-tracker/shared-models';
import {
  BatchOperationService,
  DomainEvent,
  EventBusService,
  pick,
} from '@budget-tracker/shared-utils';
import { firstValueFrom } from 'rxjs';
import { CategoryTransactionModalComponent } from './components';
import { MatDialog } from '@angular/material/dialog';
import { BaseOrchestratorService } from '../base-orchestrator.service';
@Injectable()
export class CategoryTransactionOrchestratorService extends BaseOrchestratorService {
  constructor(
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly dialog: MatDialog,
    eventBusService: EventBusService,
    batchOperationService: BatchOperationService
  ) {
    super(eventBusService, batchOperationService);
  }

  listen(): void {
    this.handleEvent<OpenCategoryTransactionModalEvent>(
      CategoryEvents.OPEN_CATEGORY_TRANSACTION_MODAL
    );
  }

  protected async eventCallback(
    event: DomainEvent<OpenCategoryTransactionModalEvent>
  ): Promise<void> {
    this.dialog.open(CategoryTransactionModalComponent, {
      data: {
        categoryId: event.payload.categoryId,
        transactionCallback: (
          categoryId: string,
          accountId: string,
          valueToAdd: number,
          convertedValueToAdd: number,
          note: string
        ) => this.transactionCallback(categoryId, accountId, valueToAdd, convertedValueToAdd, note),
      },
    });
  }

  private async transactionCallback(
    categoryId: string,
    accountId: string,
    valueToAdd: number,
    convertedValueToAdd: number,
    note: string
  ): Promise<void> {
    try {
      const category = await firstValueFrom(this.categoryFacade.getCategoryById(categoryId));

      const account = await firstValueFrom(this.accountFacade.getAccountById(accountId));

      const updatedCategoryValue = category.value + convertedValueToAdd;

      let updatedAccountValue: number;

      switch (category.budgetType) {
        case BudgetType.Income:
          updatedAccountValue = account.value + valueToAdd;

          break;

        case BudgetType.Expense:
          updatedAccountValue = account.value - valueToAdd;

          break;
      }

      const changeCategoryValueRecord: CategoryValueChangeRecord = createCategoryValueChangeRecord(
        pick(category, ['id', 'name', 'icon', 'isSystem']),
        pick(account, ['id', 'name', 'currency']),
        valueToAdd,
        convertedValueToAdd,
        account.currency,
        category.budgetType,
        note
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

      this.categoryFacade.updateCategories([
        {
          ...category,
          value: updatedCategoryValue,
        } as Category,
      ]);

      this.activityLogFacade.addRecord(changeCategoryValueRecord);
    } catch {
      throw new Error('errors.category.changeCategoryValueFlowFailed');
    }
  }
}
