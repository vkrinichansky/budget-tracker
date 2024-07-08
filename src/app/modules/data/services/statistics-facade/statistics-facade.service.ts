import { Injectable } from '@angular/core';
import { BudgetType, Category, StatisticsSnapshot } from '../../models';
import { Observable, combineLatest, map } from 'rxjs';
import { ChartData, ChartDataset } from 'chart.js';
import { MainPalette } from '@budget-tracker/design-system';
import { Store } from '@ngrx/store';
import { CategoriesSelectors, StatisticsSelectors } from '../../store';
import { LanguageService } from '../language-service/language.service';

@Injectable()
export class StatisticsFacadeService {
  constructor(
    private store: Store,
    private languageService: LanguageService
  ) {}

  getSnapshots(): Observable<StatisticsSnapshot[]> {
    return this.store.select(StatisticsSelectors.statisticsSnapshotsSelector);
  }

  getDataForMonthlyStatisticsChart(): Observable<ChartData> {
    const language = this.languageService.getCurrentLanguage();

    return combineLatest([this.getSnapshots(), this.store.select(CategoriesSelectors.allCategoriesSelector)]).pipe(
      map(([snapshots, allCategories]) => {
        const snapshotsForPreviousMonths: StatisticsSnapshot[] = snapshots
          .sort((a, b) => parseInt(a.date) - parseInt(b.date))
          .map((snapshot) => ({
            date: new Date(parseInt(snapshot.date)).toLocaleDateString(language, {
              year: 'numeric',
              month: 'short',
            }),
            categories: snapshot.categories,
          }));

        const currentMonthData: StatisticsSnapshot = {
          date: new Date().toLocaleDateString(language, {
            year: 'numeric',
            month: 'short',
          }),
          categories: [...allCategories],
        };

        const snapshotsArray = [...snapshotsForPreviousMonths, currentMonthData];

        const labels = snapshotsArray.map((monthItem) => monthItem.date);

        const categories: Category[] = [
          ...snapshotsArray.flatMap((monthItem) => monthItem.categories),
          ...allCategories,
        ];

        const uniqueCategoriesIds = [...new Set(categories.map((category) => category.id))];
        const resultCategories = uniqueCategoriesIds.map((id) => categories.find((category) => category.id === id));

        const datasets: ChartDataset[] = [
          ...this.getDatasets(resultCategories, snapshotsArray, BudgetType.Income),
          ...this.getDatasets(resultCategories, snapshotsArray, BudgetType.Expense),
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
            monthItem.categories?.find((categoryFromItem) => categoryFromItem.id === category.id)?.value || 0
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
