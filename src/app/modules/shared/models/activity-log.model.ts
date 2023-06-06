import { BudgetType } from './budget-type.enum';

export enum ActivityLogRecordType {
  RootValueChange = 'root value change',
  CategoryManagement = 'category management',
  CategoryValueChange = 'category value change',
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
}

export type ActivityLog = (RootValueChangeRecord | CategoryManagementRecord | CategoryValueChangeRecord)[];

export interface ActivityLogGroupedByDaysInObject {
  [date: string]: ActivityLog;
}

export interface ActivityLogGroupedByDays {
  date: string;
  records: ActivityLog;
}
