export enum AccountEvents {
  ADD_ACCOUNT = 'Add account',
  REMOVE_ACCOUNT = 'Remove account',
  CHANGE_ACCOUNTS_ORDER = 'Change accounts order',

  MOVE_MONEY_BETWEEN_ACCOUNTS_START = 'Move money between accounts start',
  MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH = 'Move money between accounts finish',

  EDIT_ACCOUNT_VALUE_START = 'Edit account value start',
  EDIT_ACCOUNT_VALUE_FINISH = 'Edit account value finish',
}

export interface MoveMoneyBetweenAccountsEvent {
  fromAccountId: string;
  toAccountId: string;
  valueToMove: number;
  convertedValueToMove: number;
}

export interface EditAccountValueEvent {
  accountId: string;
  value: number;
  note: string;
}
