import { Account } from './account.model';
import { ActivityLog } from './activity-log.model';
import { Category } from './category.model';
import { StatisticsSnapshot } from './statistics.model';

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

export interface Snapshots {
  snapshots: {
    [date: number]: StatisticsSnapshot;
  };
}
