export type CategoryValueMapping = { [categoryName: string]: number };

export interface MonthStatisticsDataItem {
  date: string;
  incomeCategoryValueMapping: CategoryValueMapping;
  expenseCategoryValueMapping: CategoryValueMapping;
}
