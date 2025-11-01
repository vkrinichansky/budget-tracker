# Event Bus Pattern

This document explains the Event Bus Pattern implementation in the SmartExpense application.

## What is an Event Bus?

An event bus is a communication mechanism that allows different parts of an application to communicate without direct dependencies. It implements the publish-subscribe pattern, enabling loose coupling between components, services, and domains.

## Event Bus Implementation

### EventBusService

**Purpose**: Central event communication hub for the application

**Key Features**:

- Type-safe event emission and subscription
- Event filtering by type and operation ID
- Asynchronous event waiting with promises
- Error handling and status management

**Structure**:

```typescript
@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly event$ = new Subject<DomainEvent>();

  emit<T>(event: DomainEvent<T>): void;
  on<T>(type: string): Observable<DomainEvent<T>>;
  async waitFor<T>(type: string, operationId?: string): Promise<T>;
}
```

### DomainEvent Interface

**Purpose**: Standardized event structure across the application

**Structure**:

```typescript
interface DomainEvent<T = unknown> {
  type: string; // Event type identifier
  status: DomainEventStatus; // 'success' | 'error' | 'event'
  payload?: T; // Event data
  errorCode?: string; // Error identifier
  operationId?: string; // Operation correlation ID
}
```

## Event Types and Status

### Event Status

- **'event'**: Regular domain events (e.g., user actions)
- **'success'**: Successful operation completion
- **'error'**: Failed operation with error details

### Event Naming Convention

- Use descriptive, action-based names
- Include domain context in event names
- Use past tense for completed events
- Include operation type (START/FINISH for workflows)

## Event Communication Patterns

### 1. Event Emission

Services emit events to notify other parts of the application:

```typescript
// Emit success event
this.eventBus.emit({
  type: MetadataEvents.CHANGE_LANGUAGE,
  status: 'success',
});

// Emit error event
this.eventBus.emit({
  type: MetadataEvents.CHANGE_LANGUAGE,
  status: 'error',
  errorCode: 'metadata.changeLanguageFailed',
});
```

### 2. Event Subscription

Services subscribe to events they need to react to:

```typescript
// Subscribe to specific event type
this.eventBusService
  .on<OpenCategoryTransactionModalEvent>('OPEN_CATEGORY_TRANSACTION_MODAL')
  .pipe(takeUntil(this.destroy$))
  .subscribe(async (event) => {
    await this.handleCategoryTransaction(event);
  });
```

### 3. Asynchronous Event Waiting

Services can wait for specific events to complete:

```typescript
// Wait for operation completion
await this.eventBus.waitFor(AccountEvents.ADD_ACCOUNT);

// Wait for specific operation
await this.eventBus.waitFor(AccountEvents.REMOVE_ACCOUNT, accountId);
```

## Domain Event Definitions

### Account Events

```typescript
enum AccountEvents {
  ADD_ACCOUNT = 'Add account',
  REMOVE_ACCOUNT = 'Remove account',
  CHANGE_ACCOUNTS_ORDER = 'Change accounts order',
  MOVE_MONEY_BETWEEN_ACCOUNTS_START = 'Move money between accounts start',
  MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH = 'Move money between accounts finish',
  EDIT_ACCOUNT_VALUE_START = 'Edit account value start',
  EDIT_ACCOUNT_VALUE_FINISH = 'Edit account value finish',
}

// Event data interfaces
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

### Category Events

```typescript
enum CategoryEvents {
  CREATE_CATEGORY = 'Create category',
  REMOVE_CATEGORY = 'Remove category',
  RESET_CATEGORIES_START = 'Reset categories start',
  RESET_CATEGORIES_FINISH = 'Reset categories finish',
  OPEN_CATEGORY_TRANSACTION_MODAL = 'Open category transaction modal',
}

// Event data interfaces
interface ResetCategoriesEvent {
  budgetType: BudgetType;
}

interface OpenCategoryTransactionModalEvent {
  categoryId: string;
}
```

## Event Bus Usage Patterns

### 1. Orchestrator Communication

Orchestrators use the event bus to coordinate complex workflows:

```typescript
// Start workflow
this.eventBus.emit<MoveMoneyBetweenAccountsEvent>({
  type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_START,
  status: 'event',
  payload: { fromAccountId, toAccountId, valueToMove, convertedValueToMove },
});

// Wait for completion
await this.eventBus.waitFor(AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH);
```

### 2. Cross-Domain Communication

Domains communicate through events without direct dependencies:

```typescript
// Account domain emits event
this.eventBus.emit({
  type: AccountEvents.ADD_ACCOUNT,
  status: 'success',
  payload: newAccount,
});

// Activity log domain reacts
this.eventBusService
  .on<Account>('ADD_ACCOUNT')
  .subscribe((account) => this.logAccountCreation(account));
```

### 3. Error Handling

Events provide centralized error communication:

```typescript
// Emit error event
this.eventBus.emit({
  type: MetadataEvents.CHANGE_LANGUAGE,
  status: 'error',
  errorCode: 'metadata.changeLanguageFailed',
});

// Handle error in UI
this.eventBusService
  .on('CHANGE_LANGUAGE')
  .pipe(filter((event) => event.status === 'error'))
  .subscribe((event) => this.showError(event.errorCode));
```

## Benefits of Event Bus Pattern

### Loose Coupling

- Services don't need direct references to each other
- Easy to add new event listeners
- Simple to remove or modify event handlers

### Scalability

- New features can listen to existing events
- Easy to add cross-cutting concerns
- Simple to implement event logging and monitoring

### Testability

- Easy to mock event emissions
- Simple to test event handling logic
- Clear separation of concerns

### Maintainability

- Centralized event management
- Clear event contracts
- Easy to debug event flows

## Best Practices

### Event Naming

- Use descriptive, consistent names
- Include domain context
- Use past tense for completed events
- Include operation type for workflows

### Event Structure

- Keep payloads minimal and focused
- Use TypeScript interfaces for type safety
- Include operation IDs for correlation
- Provide meaningful error codes

### Error Handling

- Always emit error events for failures
- Include descriptive error codes
- Provide context in error payloads
- Handle errors gracefully in listeners

### Performance

- Use event filtering to reduce unnecessary processing
- Implement proper subscription cleanup
- Avoid memory leaks with takeUntil pattern
- Consider event batching for high-frequency events

## Implementation Guidelines

### Creating New Events

1. Define event enum in domain models
2. Create TypeScript interface for event payload
3. Emit events with proper status and payload
4. Handle events in appropriate services

### Event Documentation

1. Document event purpose and usage
2. Provide payload examples
3. Explain event flow and dependencies
4. Include error scenarios

### Testing Events

1. Mock event emissions in tests
2. Test event handling logic
3. Verify event flow and timing
4. Test error scenarios
