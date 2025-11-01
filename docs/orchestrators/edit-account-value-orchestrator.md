# Edit Account Value Orchestrator

This orchestrator handles account value editing workflows, updating account balances and creating adjustment transactions when users manually modify account values.

## Overview

The Edit Account Value Orchestrator manages the process of manually editing account balances. It ensures that account values are updated correctly and creates appropriate adjustment category transactions to maintain transaction history.

## Responsibilities

- Listen for account value edit events
- Calculate value difference (delta)
- Determine adjustment category (income or expense)
- Update account balance
- Update adjustment category value
- Create activity log record
- Maintain data consistency

## Workflow

```mermaid
flowchart TD
    A[Event: EDIT_ACCOUNT_VALUE_START] --> B[Get Account by ID]
    B --> C[Calculate Delta: newValue - oldValue]
    C --> D{Delta Value?}
    
    D -->|Delta > 0 Increase| E[Get Income Adjustment Category]
    D -->|Delta < 0 Decrease| F[Get Expense Adjustment Category]
    
    E --> G[Create CategoryValueChangeRecord]
    F --> G
    
    G --> H[Execute Batch Operations]
    
    H --> I[Update Account Value in Firestore]
    H --> J[Update Adjustment Category Value in Firestore]
    H --> K[Add Activity Log Record to Firestore]
    
    I --> L{Batch Commit Success?}
    J --> L
    K --> L
    
    L -->|Success| M[Update Account State]
    L -->|Error| N[Emit EDIT_ACCOUNT_VALUE_FINISH Error]
    
    M --> O[Update Category State]
    O --> P[Add Record to Activity Log State]
    P --> Q[Emit EDIT_ACCOUNT_VALUE_FINISH Success]
    Q --> R[Account Value Edit Complete]
    
    style D fill:#e9ad03
    style E fill:#e2f5fd
    style F fill:#ad3546,color:#fff
    style R fill:#24b563,color:#fff
    style N fill:#ad3546,color:#fff
```

## Event Handling

### Listens For

- `AccountEvents.EDIT_ACCOUNT_VALUE_START`

### Event Payload

```typescript
interface EditAccountValueEvent {
  accountId: string;
  value: number;      // New account value
  note: string;       // Optional note/description
}
```

### Emits

- `AccountEvents.EDIT_ACCOUNT_VALUE_FINISH` (success or error)

## Dependencies

- **Account Domain**: Account data and balance updates
- **Category Domain**: Adjustment category data and updates
- **Activity Log Domain**: Transaction record creation
- **BatchOperationService**: Database transaction management
- **EventBusService**: Event communication

## Adjustment Logic

### Value Change Calculation

```typescript
delta = newValue - oldValue
absDelta = Math.abs(delta)
```

### Category Selection

- **If delta > 0** (value increased): Use Income Adjustment Category
- **If delta < 0** (value decreased): Use Expense Adjustment Category

### Updates

- **Account**: Set to new value (`event.payload.value`)
- **Adjustment Category**: Add absolute delta (`category.value + absDelta`)
- **Activity Log**: Record created with adjustment details

## Batch Operations

The orchestrator performs three Firestore operations in a single batch:

1. **Update Account**: Set new account value
2. **Update Adjustment Category**: Increase category value by absolute delta
3. **Add Activity Log Record**: Create adjustment transaction record

All operations must succeed or all are rolled back.

## Error Handling

- Catches errors during account value editing
- Emits error event with error code
- Maintains data integrity on failure
- Provides user feedback via event bus

## State Updates

After successful batch operation:
- Account state updated with new value
- Adjustment category state updated
- Activity log record added to state
- Success event emitted for UI feedback

## Usage

This orchestrator is automatically initialized when the dashboard loads and listens for account value edit events throughout the application lifecycle.
