# Account Domain

This document describes the Account domain, which manages financial accounts in the SmartExpense application.

## Overview

The Account domain is responsible for managing user financial accounts, including creating, updating, deleting accounts, handling account balances, managing account ordering, and supporting multi-currency operations.

## Domain Structure

```
account/
├── components/          # UI components for account management
├── services/           # Business logic and data access
│   ├── account-service/     # Core business logic
│   ├── account-api-service/ # Firestore data access
│   ├── account-facade/      # Public API facade
│   └── account-modal-service/ # Modal management
├── models/             # Account entities and events
├── store/              # NgRx state management
└── account.module.ts   # Domain module definition
```

## Account Model

### Account Interface

```typescript
interface Account {
  id: string;              // Unique account identifier
  name: string;            // Account name
  value: number;           // Current account balance
  currency: CurrenciesEnum; // Account currency
  icon: string;            // Account icon identifier
  bgColor: string;         // Background color (hex)
  textColor: string;       // Text color (hex)
  order: number;           // Display order
}
```

### Key Properties

- **id**: Unique identifier for the account
- **value**: Current balance stored in account currency
- **currency**: Supports multi-currency accounts
- **order**: Allows drag-and-drop reordering
- **icon**: Visual representation identifier
- **bgColor/textColor**: Customizable account colors

## Services

### AccountService

**Purpose**: Core business logic and state management

**Key Methods**:
- `getAllAccounts()`: Get all accounts as observable
- `getAccountById(accountId)`: Get account by ID
- `getFullBalance()`: Calculate total balance across all accounts in current currency
- `addAccount(account)`: Add new account with order management
- `removeAccount(accountId)`: Remove account and update orders
- `bulkAccountChangeOrder()`: Update multiple account orders
- `runMoveMoneyBetweenAccountsFlow()`: Trigger money transfer workflow
- `editAccountValue()`: Trigger account value editing workflow

### AccountApiService

**Purpose**: Firestore database operations

**Key Methods**:
- `loadAccounts()`: Load all accounts from Firestore
- `addAccount()`: Save new account to Firestore
- `removeAccount()`: Delete account from Firestore
- `bulkAccountChangeOrder()`: Update account orders in Firestore

### AccountFacadeService

**Purpose**: Public API for components

**Responsibilities**:
- Provides unified interface to components
- Delegates to AccountService and AccountApiService
- Exposes utility methods like `getAccountDocRef()`

### AccountModalService

**Purpose**: Modal dialog management

**Methods**:
- `openAccountsListModal()`: Display accounts list
- `openAddAccountsModal()`: Open add account form
- `openMoneyMovementModal()`: Open money transfer dialog
- `openEditAccountValueModal(accountId)`: Open value edit dialog

## Components

### AccountCardComponent

**Purpose**: Display individual account card

**Features**:
- Shows account name, balance, and currency
- Customizable colors and icon
- Context menu with actions (edit value, remove)
- Currency conversion display

### AccountsListModalComponent

**Purpose**: List all accounts in a modal

**Features**:
- Displays all accounts
- Drag-and-drop reordering
- Account management actions

### AddAccountModalComponent

**Purpose**: Create new account

**Features**:
- Account name input
- Currency selection
- Icon selection
- Color customization
- Initial balance setting

### EditAccountValueModalComponent

**Purpose**: Edit account balance

**Features**:
- Update account value
- Add note/description
- Triggers account value edit workflow

### MoveMoneyBetweenAccountsModalComponent

**Purpose**: Transfer money between accounts

**Features**:
- Select source and destination accounts
- Enter transfer amount
- Automatic currency conversion
- Triggers money movement workflow

### AccountsInfoCardComponent

**Purpose**: Display accounts summary information

### FullBalanceInfoCardComponent

**Purpose**: Display total balance across all accounts

**Features**:
- Multi-currency balance calculation
- Currency conversion
- Total balance display

## Store (NgRx)

### State Structure

```typescript
interface AccountState {
  accounts: EntityState<Account>;  // Accounts entity state
  isLoaded: boolean;                // Loading state flag
}
```

### Actions

- `loadAccounts`: Trigger account loading
- `accountsLoaded`: Accounts loaded from database
- `addAccount`: Add new account
- `accountAdded`: Account successfully added
- `removeAccount`: Remove account
- `accountRemoved`: Account successfully removed
- `bulkAccountChangeOrder`: Update multiple account orders
- `bulkAccountOrderChanged`: Orders successfully updated
- `accountsUpdated`: Update account values
- `cleanState`: Clear account state

### Effects

**loadAccounts$**: Loads accounts from Firestore via API service

**addAccount$**: Saves account to Firestore, updates state, and emits success event

**removeAccount$**: Deletes account from Firestore, updates state, and emits success event

**bulkAccountChangeOrder$**: Updates account orders in Firestore and state

### Selectors

- `allAccountsSelector`: Get all accounts sorted by order
- `accountByIdSelector(accountId)`: Get specific account by ID
- `fullBalanceSelector(currency, exchangeRate)`: Calculate total balance with currency conversion
- `accountsLoadedSelector`: Check if accounts are loaded

### Reducer

Uses NgRx Entity Adapter for efficient state management:
- Handles entity operations (add, remove, update)
- Manages account ordering
- Tracks loading state
- Supports bulk updates

## Events

### AccountEvents Enum

```typescript
enum AccountEvents {
  ADD_ACCOUNT = 'Add account',
  REMOVE_ACCOUNT = 'Remove account',
  CHANGE_ACCOUNTS_ORDER = 'Change accounts order',
  MOVE_MONEY_BETWEEN_ACCOUNTS_START = 'Move money between accounts start',
  MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH = 'Move money between accounts finish',
  EDIT_ACCOUNT_VALUE_START = 'Edit account value start',
  EDIT_ACCOUNT_VALUE_FINISH = 'Edit account value finish'
}
```

### Event Interfaces

```typescript
interface MoveMoneyBetweenAccountsEvent {
  fromAccountId: string;
  toAccountId: string;
  valueToMove: number;
  convertedValueToMove: number;
}

interface EditAccountValueEvent {
  accountId: string;
  value: number;
  note: string;
}
```

## Key Features

### Multi-Currency Support

- Accounts can have different currencies
- Automatic currency conversion for balance calculations
- Exchange rate integration with metadata domain

### Account Ordering

- Drag-and-drop reordering support
- Order persistence in Firestore
- Bulk order updates for efficiency

### Balance Management

- Individual account balances
- Total balance calculation across all accounts
- Currency conversion for unified display

### Account Customization

- Custom icons for visual identification
- Customizable colors (background and text)
- User-friendly account naming

## Workflows

### Add Account Flow

1. User opens add account modal
2. Fills in account details (name, currency, icon, colors, initial balance)
3. AccountService calculates new order positions
4. AccountApiService saves to Firestore
5. State updates via NgRx actions
6. Success event emitted
7. UI updates with new account

### Remove Account Flow

1. User confirms account removal
2. AccountService calculates updated order positions for remaining accounts
3. AccountApiService deletes from Firestore
4. State updates removing account and updating orders
5. Success event emitted
6. UI updates removing account card

### Move Money Between Accounts Flow

1. User opens money movement modal
2. Selects source and destination accounts
3. Enters transfer amount
4. Currency conversion calculated if needed
5. Event emitted to trigger orchestrator
6. Orchestrator coordinates account updates
7. Success event emitted on completion

### Edit Account Value Flow

1. User opens edit value modal
2. Updates account balance
3. Optionally adds note
4. Event emitted to trigger orchestrator
5. Orchestrator coordinates account and activity log updates
6. Success event emitted on completion

## Dependencies

### External Dependencies

- **Metadata Domain**: Currency information and exchange rates
- **Activity Log Domain**: Transaction logging
- **Design System**: UI components and modals
- **Shared Utils**: Event bus and utilities

### Internal Dependencies

- NgRx for state management
- Angular Material for modals
- DragDropModule for reordering
- ReactiveFormsModule for forms

## Usage Examples

### Getting All Accounts

```typescript
this.accountFacade.getAllAccounts().subscribe(accounts => {
  // Use accounts
});
```

### Adding New Account

```typescript
const newAccount: Account = {
  id: generateId(),
  name: 'Savings Account',
  value: 1000,
  currency: CurrenciesEnum.USD,
  icon: 'bank',
  bgColor: '#4CAF50',
  textColor: '#FFFFFF',
  order: 0
};

await this.accountFacade.addAccount(newAccount);
```

### Getting Account by ID

```typescript
this.accountFacade.getAccountById(accountId).subscribe(account => {
  // Use account
});
```

### Moving Money Between Accounts

```typescript
await this.accountFacade.runMoveMoneyBetweenAccountsFlow(
  fromAccountId,
  toAccountId,
  valueToMove,
  convertedValueToMove
);
```

## Best Practices

### State Management

- Always use facade service for component interactions
- Leverage NgRx selectors for computed values
- Use effects for async operations
- Handle loading and error states properly

### Account Operations

- Always update account orders when adding/removing
- Use bulk operations for order updates
- Handle currency conversion for multi-currency operations
- Emit events for workflow coordination

### Error Handling

- Handle Firestore operation errors
- Provide user feedback on failures
- Implement proper rollback mechanisms
- Use event bus for error communication
