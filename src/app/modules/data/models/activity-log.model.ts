import { BudgetType } from './budget-type.enum';

export enum ActivityLogRecordType {
  CategoryManagement = 'category-management',
  CategoryValueChange = 'category-value-change',
  CategoriesReset = 'categories-reset',
  AccountValueEdit = 'account-value-edit',
}

export enum CategoryManagementActionType {
  Add = 'add',
  Remove = 'remove',
}

export interface ActivityLogRecord {
  id: string;
  date: number;
  icon: string;
  recordType: ActivityLogRecordType;
}

export interface AccountValueEditRecord extends ActivityLogRecord {
  accountId: string;
  accountName: string;
  oldValue: number;
  newValue: number;
  note: string;
}

export interface CategoryManagementRecord extends ActivityLogRecord {
  actionType: CategoryManagementActionType;
  categoryName: string;
  budgetType: BudgetType;
}

export interface CategoryValueChangeRecord extends ActivityLogRecord {
  categoryId: string;
  categoryName: string;
  accountId: string;
  accountName: string;
  value: number;
  budgetType: BudgetType;
  note: string;
}

export interface CategoriesResetRecord extends ActivityLogRecord {
  budgetType: BudgetType;
}

export type ActivityLogRecordUnitedType =
  | AccountValueEditRecord
  | CategoryManagementRecord
  | CategoryValueChangeRecord
  | CategoriesResetRecord;

export type ActivityLog = ActivityLogRecordUnitedType[];

export interface ActivityLogGroupedByDateDictionary {
  [date: string]: ActivityLog;
}

export interface ActivityLogGroupedByDate {
  date: string;
  records: ActivityLog;
  sumOfCategoryValueChangeRecords?: number;
}
