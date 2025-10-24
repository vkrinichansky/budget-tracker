import { Injectable } from '@angular/core';
import {
  getMonthAndYearString,
  getPreviousMonthTime,
  pick,
  BatchOperationService,
} from '@budget-tracker/shared-utils';
import { MetadataFacadeService } from '@budget-tracker/metadata';
import { Snapshot, SnapshotFacadeService } from '@budget-tracker/snapshot';
import { CategoryFacadeService } from '@budget-tracker/category';
import { firstValueFrom } from 'rxjs';
import { AccountFacadeService } from '@budget-tracker/account';

@Injectable()
export class MonthResetOrchestratorService {
  constructor(
    private readonly metadataFacade: MetadataFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly batchOperationService: BatchOperationService,
    private readonly snapshotFacade: SnapshotFacadeService
  ) {}

  async doResetIfNeeded(): Promise<boolean> {
    const currentDate = getMonthAndYearString();
    const lastResetDate = this.metadataFacade.resetDate;

    if (currentDate === lastResetDate) {
      return false;
    }

    const categories = await firstValueFrom(this.categoryFacade.getAllCategories());
    const income = await firstValueFrom(this.categoryFacade.getIncomeValue());
    const expense = await firstValueFrom(this.categoryFacade.getExpenseValue());
    const fullBalance = await firstValueFrom(this.accountFacade.getFullBallance());

    const snapshot: Snapshot = {
      date: getPreviousMonthTime().toString(),
      categories: categories.map((category) =>
        pick(category, ['id', 'name', 'icon', 'value', 'budgetType', 'hexColor'])
      ),
      income: income,
      expense: expense,
      monthBalance: income - expense,
      fullBalance: fullBalance,
      currency: this.metadataFacade.currentCurrency,
    };

    await this.batchOperationService.executeBatchOperation([
      {
        docRef: this.categoryFacade.getCategoryDocRef(),
        type: 'update',
        data: categories.reduce(
          (result, category) => ({
            ...result,
            [`${category.id}.value`]: 0,
          }),
          {}
        ),
      },
      {
        docRef: this.snapshotFacade.getSnapshotDocRef(),
        type: 'update',
        data: { [snapshot.date]: snapshot },
      },
      {
        docRef: this.metadataFacade.getMetadataDocRef(),
        type: 'update',
        data: { resetDate: currentDate },
      },
    ]);

    return true;
  }
}
