import { CurrenciesEnum } from '@budget-tracker/metadata';
import { BudgetType } from '@budget-tracker/shared-models';

export interface CategoryForSnapshot {
  id: string;
  name: string;
  icon: string;
  value: number;
  budgetType: BudgetType;
  hexColor: string;
}

export interface Snapshot {
  date: string;
  categories: CategoryForSnapshot[];
  income: number;
  expense: number;
  monthBalance: number;
  fullBalance: number;
  currency: CurrenciesEnum;
}
