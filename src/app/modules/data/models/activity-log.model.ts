import { Account } from './account.model';
import { BudgetType } from './budget-type.enum';
import { Category } from './category.model';

export enum ActivityLogRecordType {
  CategoryManagement = 'category-management',
  CategoryValueChange = 'category-value-change',
  CategoriesReset = 'categories-reset',
  AccountManagement = 'account-management',
  AccountValueEdit = 'account-value-edit',
}

export enum EntityManagementActionType {
  Add = 'add',
  Remove = 'remove',
}

export interface ActivityLogRecord {
  id: string;
  date: number;
  icon: string;
  recordType: ActivityLogRecordType;
}

export interface AccountManagementRecord extends ActivityLogRecord {
  actionType: EntityManagementActionType;
  accountName: string;
}

export interface AccountValueEditRecord extends ActivityLogRecord {
  accountId: string;
  accountName: string;
  oldValue: number;
  newValue: number;
  note: string;
}

export interface CategoryManagementRecord extends ActivityLogRecord {
  actionType: EntityManagementActionType;
  categoryName: string;
  budgetType: BudgetType;
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
  | AccountManagementRecord
  | AccountValueEditRecord
  | CategoryManagementRecord
  | CategoryValueChangeRecord
  | CategoriesResetRecord;

export type ActivityLog = ActivityLogRecordUnitedType[];

export interface ActivityLogGroupedByDayDictionary {
  [date: string]: ActivityLog;
}

export interface ActivityLogGroupedByDay {
  date: string;
  records: ActivityLog;
  sumOfCategoryValueChangeRecords?: number;
}
