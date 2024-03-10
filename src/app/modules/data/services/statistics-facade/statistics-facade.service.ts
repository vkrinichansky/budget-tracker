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
import { MintChartPalette, MainPalette, CoralChartPalette } from '@budget-tracker/design-system';

interface ColorsData {
  borderColor: string;
  palette: string[];
}

@Injectable()
export class StatisticsFacadeService {
  constructor(private activityLogFacade: ActivityLogFacadeService, private categoryFacade: CategoriesFacadeService) {}

  getMonthlyStatistics(): Observable<MonthStatisticsDataItem[]> {
    return this.activityLogFacade.getActivityLogGroupedByDate().pipe(
      map((ALByDates) =>
        ALByDates.map((ALDate) => ({
          date: ALDate.date,
          incomeCategoryValueMapping: this.getCategoryValueMappingForChart(ALDate.records, BudgetType.Income),
          expenseCategoryValueMapping: this.getCategoryValueMappingForChart(ALDate.records, BudgetType.Expense),
        }))
      )
    );
  }

  getDataForMonthlyStatisticsChart(): Observable<ChartData> {
    return this.getMonthlyStatistics().pipe(
      map((statistics) => {
        const reverseStatistics = [...statistics].reverse();
        const labels = reverseStatistics.map((statisticItem) => statisticItem.date);

        const datasets: ChartDataset[] = [
          ...this.getDatasets(reverseStatistics, BudgetType.Income),
          ...this.getDatasets(reverseStatistics, BudgetType.Expense),
        ];

        return {
          labels,
          datasets,
        };
      })
    );
  }

  private getDatasets(statistics: MonthStatisticsDataItem[], budgetType: BudgetType): ChartDataset[] {
    const colors = this.resolveColors(budgetType);
    const palette = colors.palette;

    const categoriesNames = [
      ...new Set(
        statistics.flatMap((statisticsItem) => Object.keys(statisticsItem[`${budgetType}CategoryValueMapping`]))
      ),
    ];

    return categoriesNames.map((categoryName, index) => ({
      label: categoryName,
      stack: budgetType,
      data: statistics.map((statisticItem) => statisticItem[`${budgetType}CategoryValueMapping`]?.[categoryName] || 0),
      backgroundColor: palette[index >= palette.length ? index - palette.length : index],
      borderWidth: 2,
      borderRadius: 2,
      borderSkipped: 'bottom',
      borderColor: colors.borderColor,
    }));
  }

  private getCategoryValueMappingForChart(records: ActivityLog, budgetType: BudgetType): CategoryValueMapping {
    const mapping: CategoryValueMapping = {};

    const recordsFilteredByBudgetType = records
      .filter((record) => (record as CategoryValueChangeRecord).budgetType === budgetType)
      .map((record) => record as CategoryValueChangeRecord);

    recordsFilteredByBudgetType.forEach((record) => {
      if (!mapping[record.categoryName]) {
        mapping[record.categoryName] = record.value;
      } else {
        mapping[record.categoryName] = mapping[record.categoryName] + record.value;
      }
    });

    return mapping;
  }

  private resolveColors(budgetType: BudgetType): ColorsData {
    switch (budgetType) {
      case BudgetType.Income:
        return {
          borderColor: MainPalette.DarkGreen,
          palette: MintChartPalette,
        };

      case BudgetType.Expense:
        return {
          borderColor: MainPalette.Red,
          palette: CoralChartPalette,
        };
    }
  }
}
