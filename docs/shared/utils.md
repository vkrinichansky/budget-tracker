# Shared Utils

This document describes the Shared Utils module, which provides utility services and helper functions used throughout the application.

## Overview

The Shared Utils module contains reusable utility services and helper functions that provide common functionality across domains and features.

## Module Structure

```
utils/
├── services/           # Utility services
├── helpers/           # Helper functions
└── utils.module.ts    # Utils module definition
```

## Services

### EventBusService

**Purpose**: Central event communication hub

**Methods**:
- `emit<T>(event)`: Emit domain event
- `on<T>(type)`: Subscribe to event type
- `waitFor<T>(type, operationId?)`: Wait for event completion

**Usage**: See [Event Bus Pattern](../architecture/event-bus-pattern.md) documentation.

### NavigatorService

**Purpose**: Centralized navigation service

**Methods**:
- `navigateToAuthPage()`: Navigate to authentication page
- `navigateToDashboard()`: Navigate to dashboard page

**Benefits**:
- Centralized navigation logic
- Consistent navigation patterns
- Easy to update routes in one place

### BatchOperationService

**Purpose**: Firestore batch operation management

**Methods**:
- `executeBatchOperation(operations)`: Execute batch database operations

**Operations Types**:
- `update`: Update document fields
- `set`: Set document data
- `delete`: Delete document

**Usage**:
```typescript
await this.batchOperationService.executeBatchOperation([
  {
    docRef: accountDocRef,
    type: 'update',
    data: { balance: 1000 }
  },
  {
    docRef: categoryDocRef,
    type: 'update',
    data: { value: 500 }
  }
]);
```

## Helpers

### Error Helpers

#### getErrorMessage(error: unknown): string

Extracts error message from error object.

**Usage**:
```typescript
try {
  await someOperation();
} catch (error) {
  const message = getErrorMessage(error);
  this.snackbarHandler.showErrorSnackbar(message);
}
```

### Date Helpers

#### getMonthAndYearString(date?: number): string

Formats date as "M.YYYY" (e.g., "12.2024").

#### getPreviousMonthTime(): number

Returns timestamp for the first day of previous month.

#### isToday(date: Date): boolean

Checks if date is today.

**Usage**:
```typescript
const monthString = getMonthAndYearString();
// Returns "12.2024"

const previousMonth = getPreviousMonthTime();
// Returns timestamp

const isCurrentDate = isToday(new Date());
// Returns true/false
```

### Object Helpers

#### pick<T, K>(obj: T, keys: K[]): Pick<T, K>

Creates new object with only specified keys.

**Usage**:
```typescript
const user = { id: '1', name: 'John', email: 'john@example.com' };
const publicUser = pick(user, ['id', 'name']);
// Returns { id: '1', name: 'John' }
```

## Key Features

### Service Utilities

- **Event Bus**: Event-driven communication
- **Navigation**: Centralized routing
- **Batch Operations**: Database transaction management

### Helper Functions

- **Error Handling**: Error message extraction
- **Date Utilities**: Date formatting and manipulation
- **Object Utilities**: Object transformation functions

## Dependencies

### Internal Dependencies

- Angular Router (for NavigatorService)
- Angular Firestore (for BatchOperationService)
- RxJS (for EventBusService)

## Usage Examples

### Navigation

```typescript
// Navigate to auth page
this.navigator.navigateToAuthPage();

// Navigate to dashboard
this.navigator.navigateToDashboard();
```

### Error Handling

```typescript
try {
  await this.operation();
} catch (error) {
  const errorMessage = getErrorMessage(error);
  this.snackbarHandler.showErrorSnackbar(errorMessage);
}
```

### Batch Operations

```typescript
// Execute multiple database operations atomically
await this.batchOperationService.executeBatchOperation([
  {
    docRef: this.getDocRef('accounts'),
    type: 'update',
    data: { balance: newBalance }
  },
  {
    docRef: this.getDocRef('categories'),
    type: 'update',
    data: { value: newValue }
  }
]);
```

### Object Manipulation

```typescript
// Extract specific fields
const accountData = pick(account, ['id', 'name', 'balance']);
```

## Best Practices

### Service Usage

- Use services for cross-domain functionality
- Inject services via dependency injection
- Handle service errors appropriately
- Use services consistently across application

### Helper Functions

- Use helper functions for common operations
- Keep helper functions pure when possible
- Document helper function behavior
- Test helper functions thoroughly

### Error Handling

- Always use getErrorMessage for error extraction
- Provide user-friendly error messages
- Log errors appropriately
- Handle errors gracefully

### Navigation

- Use NavigatorService for all navigation
- Keep navigation logic centralized
- Update routes in one place
- Handle navigation errors
