import { Account } from '../domains/account/models/account.model';
import { ActivityLog } from '../domains/activity-log/models/activity-log.model';
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
