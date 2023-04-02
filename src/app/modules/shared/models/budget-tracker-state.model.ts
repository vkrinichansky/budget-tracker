import { RootValueChangeRecord } from './activity-log.model';
import { Category } from './category.model';

export interface BudgetTrackerState {
  income: Category[];
  expense: Category[];
  balance: number;
  savings: number;
  free: number;
  activityLog: RootValueChangeRecord[];
}
