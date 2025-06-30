import { pick } from '@budget-tracker/utils';
import { Account } from './account.model';
import { BudgetType } from './budget-type.enum';
import { Category } from './category.model';
import { v4 as uuid } from 'uuid';
import { CurrenciesEnum } from './currency.model';

type ActivityLogAccount = Pick<Account, 'id' | 'name' | 'currency'>;
type ActivityLogCategory = Pick<Category, 'id' | 'name' | 'isSystem'>;

export enum ActivityLogRecordType {
  CategoryValueChange = 'category-value-change',
  CategoriesReset = 'categories-reset',
  MoveMoneyBetweenAccounts = 'move-money-between-account',
  CurrencyChange = 'currency-change',
}

export interface TotalValueForDateByCurrency {
  currency: CurrenciesEnum;
  value: number;
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
  currency: CurrenciesEnum;
  note: string;
}

export interface CategoriesResetRecord extends ActivityLogRecord {
  budgetType: BudgetType;
}

export interface CurrencyChangeRecord extends ActivityLogRecord {
  fromCurrency: CurrenciesEnum;
  toCurrency: CurrenciesEnum;
}

export type ActivityLogRecordUnitedType =
  | CategoryValueChangeRecord
  | CategoriesResetRecord
  | MoveMoneyBetweenAccountsRecord
  | CurrencyChangeRecord;

export type ActivityLog = ActivityLogRecordUnitedType[];

export interface ActivityLogGroupedByDayDictionary {
  [date: string]: ActivityLog;
}

export interface ActivityLogGroupedByDay {
  date: string;
  records: ActivityLog;
  totalValueForDate: TotalValueForDateByCurrency[];
}

export function createCategoryValueChangeRecord(
  category: Category,
  account: Account,
  value: number,
  convertedValue: number,
  currency: CurrenciesEnum,
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
    value,
    convertedValue,
    currency,
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
    budgetType,
    date: new Date().getTime(),
    id: uuid(),
    recordType: ActivityLogRecordType.CategoriesReset,
    icon,
  };
}

export function createMoveMoneyBetweenAccountsRecord(
  fromAccount: Account,
  toAccount: Account,
  fromAccountValue: number,
  toAccountValue: number
): MoveMoneyBetweenAccountsRecord {
  return {
    id: uuid(),
    fromAccount: pick(fromAccount, ['id', 'name', 'currency']),
    toAccount: pick(toAccount, ['id', 'name', 'currency']),
    fromAccountValue,
    toAccountValue,
    recordType: ActivityLogRecordType.MoveMoneyBetweenAccounts,
    date: new Date().getTime(),
    icon: 'money-change',
  };
}

export function createCurrencyChangeRecord(
  fromCurrency: CurrenciesEnum,
  toCurrency: CurrenciesEnum
): CurrencyChangeRecord {
  return {
    id: uuid(),
    fromCurrency,
    toCurrency,
    recordType: ActivityLogRecordType.CurrencyChange,
    date: new Date().getTime(),
    icon: 'currency-change',
  };
}
