# Remove Activity Log Record Orchestrator

This orchestrator handles the removal of category transaction records from the activity log, reversing the transaction's effects on categories and accounts.

## Overview

The Remove Activity Log Record Orchestrator manages the process of deleting transaction records. When a user removes a transaction, it reverses the transaction's effects on the associated category and account, ensuring data consistency.

## Responsibilities

- Listen for record removal events
- Get the activity log record to remove
- Get associated category and account
- Reverse transaction effects
- Update category value
- Update account balance
- Remove record from activity log
- Maintain data consistency

## Workflow

```mermaid
flowchart TD
    A[Event: REMOVE_CATEGORY_VALUE_CHANGE_RECORD_START] --> B[Get Record by ID]
    B --> C[Get Category by ID]
    C --> D[Get Account by ID]
    D --> E{Transaction Type?}
    
    E -->|Income| F[Calculate Reversal: category.value - convertedValue<br/>account.value - value]
    E -->|Expense| G[Calculate Reversal: category.value - convertedValue<br/>account.value + value]
    
    F --> H[Ensure Values Don't Go Below Zero]
    G --> H
    
    H --> I[Execute Batch Operations]
    
    I --> J[Update Account Balance in Firestore]
    I --> K[Update Category Value in Firestore]
    I --> L[Remove Record from Firestore]
    
    J --> M{Batch Commit Success?}
    K --> M
    L --> M
    
    M -->|Success| N[Update Account State]
    M -->|Error| O[Emit REMOVE_RECORD_FINISH Error]
    
    N --> P[Update Category State]
    P --> Q[Remove Record from Activity Log State]
    Q --> R[Emit REMOVE_RECORD_FINISH Success]
    R --> S[Record Removal Complete]
    
    style E fill:#e9ad03
    style F fill:#e2f5fd
    style G fill:#ad3546,color:#fff
    style H fill:#e9ad03
    style S fill:#24b563,color:#fff
    style O fill:#ad3546,color:#fff
```

## Event Handling

### Listens For

- `ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_START`

### Event Payload

```typescript
interface RemoveCategoryValueChangeRecordEvent {
  recordId: string;
}
```

### Emits

- `ActivityLogEvents.REMOVE_CATEGORY_VALUE_CHANGE_RECORD_FINISH` (success or error)
  - Includes `operationId` for correlation

## Dependencies

- **Activity Log Domain**: Record data and removal
- **Category Domain**: Category data and value updates
- **Account Domain**: Account data and balance updates
- **BatchOperationService**: Database transaction management
- **EventBusService**: Event communication

## Reversal Logic

### Value Reversal

The orchestrator reverses the original transaction effects:

#### Income Transaction Reversal
- **Category**: `category.value - record.convertedValue`
- **Account**: `account.value - record.value` (decrease)

#### Expense Transaction Reversal
- **Category**: `category.value - record.convertedValue`
- **Account**: `account.value + record.value` (increase, reversing the decrease)

### Zero Protection

Values are prevented from going below zero:
```typescript
// Category
updatedValue = Math.max(0, category.value - convertedValue)

// Account (Income)
updatedValue = Math.max(0, account.value - record.value)

// Account (Expense)
updatedValue = account.value + record.value  // Always increases
```

## Batch Operations

The orchestrator performs three Firestore operations in a single batch:

1. **Update Account**: Reverse account balance change
2. **Update Category**: Reverse category value change
3. **Remove Record**: Delete activity log record (using `deleteField()`)

All operations must succeed or all are rolled back.

## Record Type

Currently handles:
- `CategoryValueChangeRecord`: Regular income/expense transactions

Other record types (currency change, category reset, money transfer) may not support removal.

## Error Handling

- Catches errors during record removal
- Emits error event with error code and operation ID
- Maintains data integrity on failure
- Provides user feedback via event bus

## State Updates

After successful batch operation:
- Account state updated with reversed balance
- Category state updated with reversed value
- Activity log record removed from state
- Success event emitted with operation ID for correlation

## Data Consistency

- Atomic operations via batch commit
- Account, category, and record updated together
- No partial updates possible
- Zero protection prevents negative values

## Usage

This orchestrator is automatically initialized when the dashboard loads and listens for record removal events throughout the application lifecycle.
