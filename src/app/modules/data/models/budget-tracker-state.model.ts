import { ActivityLog } from './activity-log.model';
import { Category } from './category.model';
import { Statistics } from './statistics.model';

export interface BudgetTrackerState {
  budget: {
    categories: {
      [categoryId: string]: Category;
    };

    rootValues: {
      balance: number;
      savings: number;
      freeMoney: number;
    };

    activityLog: ActivityLog;
  };

  statistics: Statistics;

  resetDate: string;
  shouldDoReset: boolean;
}
