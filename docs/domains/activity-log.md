# Activity Log Domain

This document describes the Activity Log domain, which tracks and displays all financial transactions and activities in the SmartExpense application.

## Overview

The Activity Log domain is responsible for recording, storing, and displaying all financial activities including category transactions, account transfers, currency changes, and category resets. It provides a chronological history of all user financial operations.

## Domain Structure

```
activity-log/
├── components/          # UI components for displaying activity records
├── services/           # Business logic and data access
│   ├── activity-log-service/     # Core business logic
│   ├── activity-log-api-service/ # Firestore data access
│   └── activity-log-facade/      # Public API facade
├── models/             # Activity log entities and events
├── store/              # NgRx state management
└── activity-log.module.ts # Domain module definition
```

## Activity Log Models

### ActivityLogRecordType Enum

```typescript
enum ActivityLogRecordType {
  CategoryValueChange = 'category-value-change',
  CategoriesReset = 'categories-reset',
  MoveMoneyBetweenAccounts = 'move-money-between-account',
  CurrencyChange = 'currency-change'
}
```

### Base ActivityLogRecord Interface

```typescript
interface ActivityLogRecord {
  id: string;              // Unique record identifier
  date: number;            // Timestamp in milliseconds
  icon: string;            // Icon identifier for display
  recordType: ActivityLogRecordType; // Type of activity record
}
```

### Record Type Interfaces

#### CategoryValueChangeRecord
Records category transactions (income/expense):

```typescript
interface CategoryValueChangeRecord extends ActivityLogRecord {
  category: ActivityLogCategory;
  account: ActivityLogAccount;
  value: number;           // Transaction amount in account currency
  convertedValue: number;  // Converted to current currency
  budgetType: BudgetType;  // Income or Expense
  currency: CurrenciesEnum;
  note: string;            // Optional transaction note
}
```

#### MoveMoneyBetweenAccountsRecord
Records money transfers between accounts:

```typescript
interface MoveMoneyBetweenAccountsRecord extends ActivityLogRecord {
  fromAccount: ActivityLogAccount;
  toAccount: ActivityLogAccount;
  fromAccountValue: number; // Amount in source account currency
  toAccountValue: number;   // Amount in destination account currency
}
```

#### CategoriesResetRecord
Records category reset operations:

```typescript
interface CategoriesResetRecord extends ActivityLogRecord {
  budgetType: BudgetType;  // Income or Expense categories reset
}
```

#### CurrencyChangeRecord
Records currency change operations:

```typescript
interface CurrencyChangeRecord extends ActivityLogRecord {
  fromCurrency: CurrenciesEnum;
  toCurrency: CurrenciesEnum;
}
```

### Grouped Data Structures

```typescript
interface ActivityLogGroupedByDay {
  date: string;                           // Formatted date string
  records: ActivityLog;                   // Records for this day
  totalValueForDate: TotalValueForDateByCurrency[]; // Daily totals by currency
}

interface TotalValueForDateByCurrency {
  currency: CurrenciesEnum;
  value: number;
}
```

### Factory Functions

The domain provides factory functions for creating records:

- `createCategoryValueChangeRecord()`: Creates category transaction records
- `createMoveMoneyBetweenAccountsRecord()`: Creates transfer records
- `createCategoriesResetRecord()`: Creates reset records
- `createCurrencyChangeRecord()`: Creates currency change records

## Services

### ActivityLogService

**Purpose**: Core business logic and state management

**Key Methods**:
- `getActivityLogGroupedByDays()`: Get activity log grouped by days
- `getRecordById(recordId)`: Get specific record by ID
- `addRecord(record)`: Add new activity record
- `removeRecord(recordId)`: Remove activity record
- `removeAllRecords()`: Clear all activity log records
- `loadActivityLog()`: Load activity log from store/database

### ActivityLogApiService

**Purpose**: Firestore database operations

**Key Methods**:
- `loadActivityLog()`: Load all records from Firestore
- `bulkRecordRemove()`: Remove all records from Firestore
- `getDocRef()`: Get Firestore document reference

### ActivityLogFacadeService

**Purpose**: Public API for components

**Responsibilities**:
- Provides unified interface to components
- Delegates to ActivityLogService and ActivityLogApiService
- Exposes utility methods

## Components

### ActivityLogComponent

**Purpose**: Main activity log display component

**Features**:
- Displays all activity records grouped by date
- Shows daily totals by currency
- Supports record removal
- Empty state handling
- Virtual scrolling for performance

### Record Display Components

#### CategoryValueChangeRecordComponent
Displays category transaction records with category, account, amount, and note details.

#### MoveMoneyBetweenAccountsRecordComponent
Displays money transfer records showing source and destination accounts with amounts.

#### CategoriesResetRecordComponent
Displays category reset records indicating which budget type was reset.

#### CurrencyChangeRecordComponent
Displays currency change records showing old and new currencies.

#### GenericActivityLogRecordComponent
Generic component for rendering any activity log record type.

## Store (NgRx)

### State Structure

```typescript
interface ActivityLogState {
  activityLogRecords: EntityState<ActivityLogRecordUnitedType>;
  isLoaded: boolean;
}
```

### Actions

- `loadActivityLog`: Trigger activity log loading
- `activityLogLoaded`: Activity log loaded from database
- `recordAdded`: Add new activity record to state
- `recordRemoved`: Remove activity record from state
- `bulkRecordsRemove`: Trigger bulk removal
- `bulkRecordsRemoved`: Bulk removal completed
- `bulkRecordsRemoveFail`: Bulk removal failed
- `cleanState`: Clear activity log state

### Effects

**loadActivityLog$**: Loads activity log from Firestore via API service

**bulkRecordsRemove$**: Removes all records from Firestore, updates state, and emits success/error events

### Selectors

- `activityLogSelector`: Get all activity log records
- `selectRecordByIdSelector(recordId)`: Get specific record by ID
- `activityLogGroupedByDaysSelector(language)`: Get records grouped by days with formatted dates
- `activityLogLoadedSelector`: Check if activity log is loaded
- `activityLogDictionarySelector`: Get records as dictionary

### Reducer

Uses NgRx Entity Adapter for efficient state management:
- Handles entity operations (add, remove, bulk operations)
- Tracks loading state
- Supports batch updates

## Events

### ActivityLogEvents Enum

```typescript
enum ActivityLogEvents {
  REMOVE_ALL_RECORDS = 'Remove all records',
  REMOVE_CATEGORY_VALUE_CHANGE_RECORD_START = 'Remove category value change record start',
  REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH = 'Remove category value change record finish'
}
```

### Event Interfaces

```typescript
interface RemoveCategoryValueChangeRecordEvent {
  recordId: string;
}
```

## Key Features

### Record Types

The domain supports four main record types:
- **Category Transactions**: Income and expense category operations
- **Money Transfers**: Account-to-account transfers
- **Category Resets**: Monthly category reset operations
- **Currency Changes**: User currency preference changes

### Date Grouping

- Records are automatically grouped by date
- Daily totals calculated per currency
- Chronological ordering (newest first)
- Locale-aware date formatting

### Currency Handling

- Records maintain original currency information
- Supports multi-currency records
- Daily totals calculated per currency
- Conversion values stored for display

### Record Creation

- Factory functions for type-safe record creation
- Automatic ID generation using UUID
- Timestamp management
- Icon assignment based on record type

## Workflows

### Adding Activity Record Flow

1. Domain service or orchestrator creates record using factory function
2. Record added to state via NgRx action
3. Record saved to Firestore via API service
4. UI updates to show new record
5. Records automatically grouped by date

### Loading Activity Log Flow

1. Component requests activity log via facade
2. Service checks if already loaded
3. If not loaded, dispatches load action
4. Effect loads from Firestore
5. Records added to state
6. Selectors provide grouped data to component

### Removing Record Flow

1. User initiates record removal
2. Confirmation modal displayed
3. Record removal action dispatched
4. Record removed from state
5. Firestore updated (if needed)
6. UI updates removing record

### Bulk Remove Flow

1. User initiates bulk removal
2. Confirmation modal displayed
3. Bulk remove action dispatched
4. Effect clears Firestore document
5. All records removed from state
6. Success event emitted
7. UI updates showing empty state

## Dependencies

### External Dependencies

- **Account Domain**: Account information for transactions
- **Category Domain**: Category information for transactions
- **Metadata Domain**: Currency and language information
- **Design System**: UI components and modals
- **Shared Utils**: Event bus and utilities

### Internal Dependencies

- NgRx for state management
- Angular CDK Scrolling for virtual scrolling
- UUID for record ID generation
- Angular Material for modals

## Usage Examples

### Getting Activity Log Grouped by Days

```typescript
this.activityLogFacade.getActivityLogGroupedByDays().subscribe(groups => {
  groups.forEach(group => {
    console.log(group.date, group.records.length);
    group.totalValueForDate.forEach(total => {
      console.log(total.currency, total.value);
    });
  });
});
```

### Adding Category Transaction Record

```typescript
const record = createCategoryValueChangeRecord(
  category,
  account,
  100.50,
  100.50,
  CurrenciesEnum.USD,
  BudgetType.Expense,
  'Grocery shopping'
);

this.activityLogFacade.addRecord(record);
```

### Adding Money Transfer Record

```typescript
const record = createMoveMoneyBetweenAccountsRecord(
  fromAccount,
  toAccount,
  500,
  490
);

this.activityLogFacade.addRecord(record);
```

### Removing All Records

```typescript
await this.activityLogFacade.removeAllRecords();
```

## Best Practices

### Record Creation

- Always use factory functions for record creation
- Include all required fields
- Provide meaningful notes for transactions
- Maintain currency information accurately

### State Management

- Use facade service for component interactions
- Leverage selectors for computed values
- Use effects for async operations
- Handle loading and error states properly

### Performance

- Use virtual scrolling for large activity logs
- Leverage entity adapter for efficient state updates
- Group records by date in selectors
- Cache formatted dates appropriately

### Data Consistency

- Records should be created when operations complete
- Maintain referential integrity with accounts/categories
- Handle deleted accounts/categories gracefully
- Preserve historical data accurately
