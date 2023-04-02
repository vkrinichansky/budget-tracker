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
}

export enum CategoryValueActionType {
  Increase = 'increase',
  Decrease = 'decrease',
}

export interface CategoryValueChangeRecord extends ActivityLogRecord {
  actionType: CategoryValueActionType;
  categoryName: string;
  value: number;
}

export type ActivityLog = RootValueChangeRecord[];

export interface ActivityLogGroupedByDaysInObject {
  [date: string]: ActivityLog;
}

export interface ActivityLogGroupedByDays {
  date: string;
  records: ActivityLog;
}
