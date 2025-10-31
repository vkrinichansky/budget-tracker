# Orchestrator Pattern

This document explains the Orchestrator Pattern implementation in the SmartExpense application.

## What is an Orchestrator?

An orchestrator is a service that coordinates complex business workflows across multiple domains. It acts as a conductor, managing the sequence of operations, handling cross-domain communication, and ensuring data consistency throughout the process.

## Orchestrator Responsibilities

### Workflow Coordination

- Manage multi-step business processes
- Coordinate operations across different domains
- Handle complex business rules and validations
- Ensure proper sequence of operations

### Cross-Domain Communication

- Bridge communication between domains
- Manage event-driven interactions
- Handle data transformation between domains
- Maintain loose coupling between services

### Error Handling and Recovery

- Implement rollback mechanisms
- Handle partial failures gracefully
- Provide transaction-like behavior
- Ensure data consistency

## Base Orchestrator Services

### BaseOrchestratorService

**Purpose**: Abstract base class for all orchestrators

**Key Features**:

- Event-driven architecture with EventBus integration
- Automatic subscription management with takeUntil pattern
- Batch operation support for database transactions
- Lifecycle management (listen/destroy)

**Structure**:

```typescript
abstract class BaseOrchestratorService {
  protected readonly destroy$ = new Subject<void>();

  abstract listen(): void;
  protected abstract eventCallback(event: DomainEvent<unknown>): Promise<void> | void;

  protected handleEvent<T>(eventType: string): void;
  destroy(): void;
}
```

**Responsibilities**:

- Event subscription and unsubscription
- Memory leak prevention
- Event handling abstraction
- Lifecycle management

### BaseOrchestratorManager

**Purpose**: Manages multiple orchestrators as a group

**Key Features**:

- Centralized orchestrator initialization
- Bulk lifecycle management
- Orchestrator collection management
- Simplified orchestrator coordination

**Structure**:

```typescript
abstract class BaseOrchestratorManager {
  protected abstract orchestrators: BaseOrchestratorService[];

  init(): void;
  destroyAll(): void;
}
```

**Responsibilities**:

- Initialize all orchestrators
- Manage orchestrator lifecycle
- Provide centralized control
- Simplify orchestrator management

## Orchestrator Implementation Pattern

### 1. Event-Driven Architecture

Orchestrators listen for specific domain events and react accordingly:

```typescript
// Example: Listening for account creation
protected handleEvent<AccountCreatedEvent>('ACCOUNT_CREATED'): void {
  this.eventBusService
    .on<AccountCreatedEvent>('ACCOUNT_CREATED')
    .pipe(takeUntil(this.destroy$))
    .subscribe(async (event) => {
      await this.handleAccountCreated(event);
    });
}
```

### 2. Batch Operations

Orchestrators use batch operations for database consistency:

```typescript
// Example: Batch database updates
async handleAccountCreated(event: AccountCreatedEvent): Promise<void> {
  await this.batchOperationService.executeBatch([
    () => this.accountService.updateAccount(event.account),
    () => this.activityLogService.logAccountCreation(event.account),
    () => this.metadataService.updateAccountCount()
  ]);
}
```

### 3. Error Handling

Orchestrators implement comprehensive error handling:

```typescript
async handleAccountCreated(event: AccountCreatedEvent): Promise<void> {
  try {
    await this.batchOperationService.executeBatch(operations);
  } catch (error) {
    // Rollback operations
    await this.rollbackOperations(event);
    // Emit error event
    this.eventBusService.emit('ACCOUNT_CREATION_FAILED', { error, event });
  }
}
```

## Benefits of Orchestrator Pattern

### Separation of Concerns

- Business logic separated from domain services
- Complex workflows isolated
- Easier testing and maintenance

### Reusability

- Orchestrators can be reused across different contexts
- Common patterns abstracted into base classes
- Consistent implementation across the application

### Maintainability

- Clear workflow documentation
- Centralized error handling
- Easier debugging and monitoring

### Scalability

- New orchestrators can be added without affecting existing ones
- Event-driven architecture supports loose coupling
- Easy to extend and modify workflows

## Best Practices

### Event Naming

- Use consistent event naming conventions
- Include domain and action in event names
- Use past tense for completed events

### Error Handling

- Always implement proper error handling
- Provide meaningful error messages
- Implement rollback mechanisms

### Testing

- Unit test orchestrator logic
- Mock external dependencies
- Test error scenarios

### Documentation

- Document orchestrator responsibilities
- Explain workflow steps
- Provide usage examples

## Implementation Guidelines

### Creating New Orchestrators

1. Extend BaseOrchestratorService
2. Implement listen() method
3. Define eventCallback() method
4. Handle specific business logic
5. Implement error handling
6. Add to orchestrator manager

### Managing Orchestrators

1. Add to BaseOrchestratorManager
2. Initialize in application startup
3. Handle lifecycle properly
4. Monitor orchestrator health

### Event Design

1. Define clear event contracts
2. Use TypeScript interfaces
3. Include necessary data
4. Consider event versioning
