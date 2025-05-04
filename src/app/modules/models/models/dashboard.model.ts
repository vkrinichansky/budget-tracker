import { Account } from './account.model';
import { ActivityLog } from './activity-log.model';
import { Category } from './category.model';

export interface Dashboard {
  categories: {
    [categoryId: string]: Category;
  };
  accounts: {
    [accountId: string]: Account;
  };
  activityLog: ActivityLog;
  resetDate: string;
}
