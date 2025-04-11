import { Account } from './account.model';
import { ActivityLog } from './activity-log.model';
import { Category } from './category.model';
import { Statistics } from './statistics.model';

export interface AppDatabaseStructure {
  budget: {
    categories: {
      [categoryId: string]: Category;
    };

    accounts: {
      [accountId: string]: Account;
    };

    activityLog: ActivityLog;
  };

  statistics: Statistics;

  resetDate: string;
  shouldDoReset: boolean;
}
