import { Injectable } from '@angular/core';
import { ActivityLogFacadeService } from '../activity-log-facade/activity-log-facade.service';
import {
  ActivityLog,
  BudgetType,
  CategoryValueMapping,
  CategoryValueChangeRecord,
  MonthStatisticsDataItem,
  Category,
} from '../../models';
import { Observable, combineLatest, map } from 'rxjs';
import { ChartData, ChartDataset } from 'chart.js';
import { CategoriesFacadeService } from '../categories-facade/categories-facade.service';
import { MainPalette } from '@budget-tracker/design-system';

@Injectable()
export class StatisticsFacadeService {
  constructor(
    private activityLogFacade: ActivityLogFacadeService,
    private categoryFacade: CategoriesFacadeService
  ) {}

  getMonthlyStatistics(): Observable<MonthStatisticsDataItem[]> {
    return this.activityLogFacade.getActivityLogGroupedByMonths().pipe(
      map((activityLogByMonths) =>
        activityLogByMonths.map((monthItem) => ({
          date: monthItem.date,
          incomeCategoryValueMapping: this.getCategoryValueMappingForChart(monthItem.records, BudgetType.Income),
          expenseCategoryValueMapping: this.getCategoryValueMappingForChart(monthItem.records, BudgetType.Expense),
        }))
      )
    );
  }

  getDataForMonthlyStatisticsChart(): Observable<ChartData> {
    return combineLatest([this.categoryFacade.getAllCategoriesDictionary(), this.getMonthlyStatistics()]).pipe(
      map(([categoriesDictionary, statistics]) => {
        const reverseStatistics = [...statistics].reverse();
        const labels = reverseStatistics.map((statisticItem) => statisticItem.date);

        const categories: Category[] = [
          ...new Set(
            reverseStatistics.flatMap((statisticsItem) =>
              Object.keys({
                ...statisticsItem.expenseCategoryValueMapping,
                ...statisticsItem.incomeCategoryValueMapping,
              })
            )
          ),
        ].map((categoryId) => categoriesDictionary?.[categoryId]);

        const datasets: ChartDataset[] = [
          ...this.getDatasets(categories, reverseStatistics, BudgetType.Income),
          ...this.getDatasets(categories, reverseStatistics, BudgetType.Expense),
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
    statistics: MonthStatisticsDataItem[],
    budgetType: BudgetType
  ): ChartDataset[] {
    return categories.map((category) => ({
      label: category.name,
      stack: budgetType,
      data: statistics.map((statisticItem) => statisticItem[`${budgetType}CategoryValueMapping`]?.[category.id] || 0),
      backgroundColor: category.hexColor,
      borderWidth: 2,
      borderRadius: 2,
      borderSkipped: 'bottom',
      borderColor: this.resolveBorderColors(budgetType),
      weight: statistics
        .map((statisticItem) => statisticItem[`${budgetType}CategoryValueMapping`]?.[category.id] || 0)
        .reduce((result, value) => result + value, 0),
    }));
  }

  private getCategoryValueMappingForChart(records: ActivityLog, budgetType: BudgetType): CategoryValueMapping {
    const mapping: CategoryValueMapping = {};

    const recordsFilteredByBudgetType = records
      .filter((record) => (record as CategoryValueChangeRecord).budgetType === budgetType)
      .map((record) => record as CategoryValueChangeRecord);

    recordsFilteredByBudgetType.forEach((record) => {
      if (!mapping[record.categoryId]) {
        mapping[record.categoryId] = record.value;
      } else {
        mapping[record.categoryId] = mapping[record.categoryId] + record.value;
      }
    });

    return mapping;
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
