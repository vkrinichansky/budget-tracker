import { BudgetType } from './budget-type.enum';

export enum ActivityLogRecordType {
  RootValueChange = 'root value change',
  CategoryManagement = 'category management',
  CategoryValueChange = 'category value change',
  CategoriesReset = 'categories reset',
}

export interface ActivityLogRecord {
  id: string;
  date: number;
  icon: string;
  recordType: ActivityLogRecordType;
}

export enum RootValueActionType {
  Increase = 'increase',
  Decrease = 'decrease',
  Edit = 'edit',
}

export enum RootValueType {
  Balance = 'balance',
  Savings = 'savings',
  FreeMoney = 'free',
}

export interface RootValueChangeRecord extends ActivityLogRecord {
  actionType: RootValueActionType;
  valueType: RootValueType;
  value?: number;
  oldValue?: number;
  newValue?: number;
  note?: string;
}

export enum CategoryManagementActionType {
  Add = 'add',
  Remove = 'remove',
}

export interface CategoryManagementRecord extends ActivityLogRecord {
  actionType: CategoryManagementActionType;
  categoryName: string;
  budgetType: BudgetType;
}

export interface CategoryValueChangeRecord extends ActivityLogRecord {
  categoryName: string;
  value: number;
  budgetType: BudgetType;
  note: string;
  isReset: boolean;
}

export interface CategoryValueChangeRecord extends ActivityLogRecord {
  categoryName: string;
  value: number;
  budgetType: BudgetType;
  note: string;
  isReset: boolean;
}

export interface CategoriesResetRecord extends ActivityLogRecord {
  budgetType: BudgetType;
}

export type ActivityLogRecordUnitedType =
  | RootValueChangeRecord
  | CategoryManagementRecord
  | CategoryValueChangeRecord
  | CategoriesResetRecord;

export type ActivityLog = ActivityLogRecordUnitedType[];

export interface ActivityLogGroupedByDateInObject {
  [date: string]: ActivityLog;
}

export interface ActivityLogGroupedByDate {
  date: string;
  records: ActivityLog;
}
