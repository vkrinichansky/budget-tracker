export enum ActivityLogEvents {
  ADD_RECORD = 'Add record',
  REMOVE_ALL_RECORDS = 'Remove all records',

  REMOVE_CATEGORY_VALUE_CHANGE_RECORD = 'Remove category value change record',
  REMOVE_CATEGORY_VALUE_CHANGE_RECORD_START = 'Remove category value change record start',
  REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH = 'Remove category value change record finish',
}

export interface RemoveCategoryValueChangeRecordEvent {
  recordId: string;
}
