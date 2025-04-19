import { Injectable } from '@angular/core';
import { BudgetType, Category, StatisticsSnapshot } from '@budget-tracker/models';
import { Observable, map } from 'rxjs';
import { ChartData, ChartDataset } from 'chart.js';
import { MainPalette } from '@budget-tracker/design-system';
import { Store } from '@ngrx/store';
import { StatisticsSelectors } from '../../store';
import { LanguageFacadeService } from '@budget-tracker/metadata';

@Injectable()
export class StatisticsFacadeService {
  constructor(
    private store: Store,
    private languageFacade: LanguageFacadeService
  ) {}

  getSnapshots(): Observable<StatisticsSnapshot[]> {
    return this.store.select(StatisticsSelectors.statisticsSnapshotsSelector);
  }

  getDataForMonthlyStatisticsChart(): Observable<ChartData> {
    const language = this.languageFacade.getCurrentLanguage();

    return this.getSnapshots().pipe(
      map((snapshots) => {
        const snapshotsForPreviousMonths: StatisticsSnapshot[] = snapshots
          .sort((a, b) => parseInt(a.date) - parseInt(b.date))
          .map((snapshot) => ({
            date: new Date(parseInt(snapshot.date)).toLocaleDateString(language, {
              year: 'numeric',
              month: 'short',
            }),
            categories: snapshot.categories,
            expense: 0,
            income: 0,
            monthBalance: 0,
            totalBalance: 0,
          }));

        const labels = snapshotsForPreviousMonths.map((monthItem) => monthItem.date);

        const categories: Category[] = snapshotsForPreviousMonths.flatMap(
          (monthItem) => monthItem.categories
        );
        const uniqueCategoriesIds = [...new Set(categories.map((category) => category.id))];
        const resultCategories = uniqueCategoriesIds.map((id) =>
          categories.find((category) => category.id === id)
        );

        const datasets: ChartDataset[] = [
          ...this.getDatasets(resultCategories, snapshotsForPreviousMonths, BudgetType.Income),
          ...this.getDatasets(resultCategories, snapshotsForPreviousMonths, BudgetType.Expense),
        ];

        return {
          labels,
          datasets,
        };
      })
    );
  }

  private getDatasets(
    categories: Category[],
    statistics: StatisticsSnapshot[],
    budgetType: BudgetType
  ): ChartDataset[] {
    return categories
      .filter((category) => category.budgetType === budgetType)
      .map((category) => ({
        label: category.name,
        stack: budgetType,
        data: statistics.map(
          (monthItem) =>
            monthItem.categories?.find((categoryFromItem) => categoryFromItem.id === category.id)
              ?.value || 0
        ),
        backgroundColor: category.hexColor,
        borderWidth: 2,
        borderRadius: 2,
        borderSkipped: 'bottom',
        borderColor: this.resolveBorderColors(budgetType),
      }));
  }

  private resolveBorderColors(budgetType: BudgetType): MainPalette {
    switch (budgetType) {
      case BudgetType.Income:
        return MainPalette.DarkGreen;

      case BudgetType.Expense:
        return MainPalette.Red;
    }
  }
}
