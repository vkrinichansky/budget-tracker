import { Account } from './account.model';
import { BudgetType } from './budget-type.enum';
import { Category } from './category.model';

export enum ActivityLogRecordType {
  CategoryValueChange = 'category-value-change',
  CategoriesReset = 'categories-reset',
  AccountValueChange = 'account-value-edit',
  MoveMoneyBetweenAccounts = 'move-money-between-account',
}

export interface ActivityLogRecord {
  id: string;
  date: number;
  icon: string;
  recordType: ActivityLogRecordType;
}

export interface AccountValueEditRecord extends ActivityLogRecord {
  account: Account;
  oldValue: number;
  newValue: number;
  note: string;
}

export interface MoveMoneyBetweenAccountsRecord extends ActivityLogRecord {
  fromAccount: Account;
  toAccount: Account;
  fromAccountValue: number;
  toAccountValue: number;
}

export interface CategoryValueChangeRecord extends ActivityLogRecord {
  category: Category;
  account: Account;
  value: number;
  convertedValue: number;
  budgetType: BudgetType;
  note: string;
}

export interface CategoriesResetRecord extends ActivityLogRecord {
  budgetType: BudgetType;
}

export type ActivityLogRecordUnitedType =
  | AccountValueEditRecord
  | CategoryValueChangeRecord
  | CategoriesResetRecord
  | MoveMoneyBetweenAccountsRecord;

export type ActivityLog = ActivityLogRecordUnitedType[];

export interface ActivityLogGroupedByDayDictionary {
  [date: string]: ActivityLog;
}

export interface ActivityLogGroupedByDay {
  date: string;
  records: ActivityLog;
  totalValueForDate?: number;
}
