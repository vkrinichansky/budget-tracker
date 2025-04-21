import { pick } from '@budget-tracker/utils';
import { Account } from './account.model';
import { BudgetType } from './budget-type.enum';
import { Category } from './category.model';
import { v4 as uuid } from 'uuid';

type ActivityLogAccount = Pick<Account, 'id' | 'name' | 'currency'>;
type ActivityLogCategory = Pick<Category, 'id' | 'name' | 'isSystem'>;

export enum ActivityLogRecordType {
  CategoryValueChange = 'category-value-change',
  CategoriesReset = 'categories-reset',
  MoveMoneyBetweenAccounts = 'move-money-between-account',
}

export interface ActivityLogRecord {
  id: string;
  date: number;
  icon: string;
  recordType: ActivityLogRecordType;
}

export interface MoveMoneyBetweenAccountsRecord extends ActivityLogRecord {
  fromAccount: ActivityLogAccount;
  toAccount: ActivityLogAccount;
  fromAccountValue: number;
  toAccountValue: number;
}

export interface CategoryValueChangeRecord extends ActivityLogRecord {
  category: ActivityLogCategory;
  account: ActivityLogAccount;
  value: number;
  convertedValue: number;
  budgetType: BudgetType;
  note: string;
}

export interface CategoriesResetRecord extends ActivityLogRecord {
  budgetType: BudgetType;
}

export type ActivityLogRecordUnitedType =
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

export function createCategoryValueChangeRecord(
  category: Category,
  account: Account,
  valueToAdd: number,
  convertedValueToAdd: number,
  note: string
): CategoryValueChangeRecord {
  return {
    id: uuid(),
    budgetType: category.budgetType,
    category: pick(category, ['id', 'name', 'isSystem']),
    account: pick(account, ['id', 'name', 'currency']),
    date: new Date().getTime(),
    icon: category.icon,
    recordType: ActivityLogRecordType.CategoryValueChange,
    value: valueToAdd,
    convertedValue: convertedValueToAdd,
    note,
  };
}

export function createCategoriesResetRecord(budgetType: BudgetType): CategoriesResetRecord {
  let icon: string;

  switch (budgetType) {
    case BudgetType.Income:
      icon = 'arrow-up';
      break;

    case BudgetType.Expense:
      icon = 'arrow-down';
      break;
  }

  return {
    budgetType: budgetType,
    date: new Date().getTime(),
    id: uuid(),
    recordType: ActivityLogRecordType.CategoriesReset,
    icon,
  };
}

export function createMoveMoneyBetweenAccountsRecord(
  fromAccount: Account,
  toAccount: Account,
  valueToMove: number,
  convertedValueToMove: number
): MoveMoneyBetweenAccountsRecord {
  return {
    id: uuid(),
    fromAccount: pick(fromAccount, ['id', 'name', 'currency']),
    toAccount: pick(toAccount, ['id', 'name', 'currency']),
    fromAccountValue: valueToMove,
    toAccountValue: convertedValueToMove,
    recordType: ActivityLogRecordType.MoveMoneyBetweenAccounts,
    date: new Date().getTime(),
    icon: 'money-change',
  };
}
