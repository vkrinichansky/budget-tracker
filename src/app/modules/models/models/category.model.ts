import { BudgetType } from './budget-type.enum';

export interface Category {
  id: string;
  name: string;
  icon: string;
  value: number;
  budgetType: BudgetType;
  hexColor?: string;
}
