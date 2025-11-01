# Snapshot Domain

This document describes the Snapshot domain, which manages monthly financial snapshots for historical tracking and reporting in the SmartExpense application.

## Overview

The Snapshot domain is responsible for creating, storing, and displaying monthly financial snapshots. These snapshots capture the state of categories, balances, and financial data at the end of each month, enabling users to track financial progress over time.

## Domain Structure

```
snapshot/
├── components/          # UI components for snapshot display
├── services/           # Business logic and data access
│   ├── snapshot-service/     # Core business logic
│   ├── snapshot-api-service/ # Firestore data access
│   └── snapshot-facade/      # Public API facade
├── models/             # Snapshot entities
├── store/              # NgRx state management
└── snapshot.module.ts  # Domain module definition
```

## Snapshot Model

### Snapshot Interface

```typescript
interface Snapshot {
  date: string;                    // Snapshot date (format: YYYY-MM)
  categories: CategoryForSnapshot[]; // Categories at snapshot time
  income: number;                  // Total income for the month
  expense: number;                 // Total expenses for the month
  monthBalance: number;            // Monthly balance (income - expense)
  fullBalance: number;             // Total account balance at snapshot
  currency: CurrenciesEnum;        // Currency at snapshot time
}
```

### CategoryForSnapshot Interface

```typescript
interface CategoryForSnapshot {
  id: string;
  name: string;
  icon: string;
  value: number;           // Category value at snapshot time
  budgetType: BudgetType;
  hexColor: string;
}
```

### Key Properties

- **date**: Monthly snapshot identifier (YYYY-MM format)
- **categories**: Complete category state at snapshot time
- **income**: Total income accumulated during the month
- **expense**: Total expenses accumulated during the month
- **monthBalance**: Net balance for the month (income - expense)
- **fullBalance**: Total account balance across all accounts
- **currency**: Currency used for snapshot values

## Services

### SnapshotService

**Purpose**: Core business logic and state management

**Key Methods**:
- `getSnapshots()`: Get all snapshots as observable
- `snapshotsLoaded()`: Check if snapshots are loaded
- `loadSnapshots()`: Load snapshots from store/database
- `addSnapshot(snapshot)`: Add snapshot to local state

### SnapshotApiService

**Purpose**: Firestore database operations

**Key Methods**:
- `loadSnapshots()`: Load all snapshots from Firestore
- `addSnapshot()`: Save new snapshot to Firestore

### SnapshotFacadeService

**Purpose**: Public API for components

**Responsibilities**:
- Provides unified interface to components
- Delegates to SnapshotService and SnapshotApiService

**Key Methods**:
- `addSnapshot(snapshot)`: Add snapshot to local state

## Components

### SnapshotsListComponent

**Purpose**: Display list of all monthly snapshots

**Features**:
- Lists all snapshots chronologically
- Snapshot summary information
- Navigate to snapshot details
- Historical data overview

### SnapshotItemComponent

**Purpose**: Display individual snapshot item

**Features**:
- Snapshot date display
- Income and expense totals
- Monthly balance display
- Full balance at snapshot time
- Category summary information

## Store (NgRx)

### State Structure

```typescript
interface SnapshotState {
  snapshots: EntityState<Snapshot>;
  isLoaded: boolean;
}
```

### Actions

- `loadSnapshots`: Trigger snapshot loading
- `snapshotsLoaded`: Snapshots loaded from database
- `snapshotAdded`: New snapshot added to state
- `cleanState`: Clear snapshot state

### Effects

**loadSnapshots$**: Loads snapshots from Firestore via API service

### Selectors

- `allSnapshotsSelector`: Get all snapshots
- `snapshotsLoadedSelector`: Check if snapshots are loaded

### Reducer

Uses NgRx Entity Adapter for efficient state management:
- Handles entity operations (add, load)
- Tracks loading state
- Supports snapshot storage

## Key Features

### Monthly Snapshots

- **Automatic Creation**: Snapshots created during month reset
- **Historical Preservation**: Complete financial state preserved
- **Date-Based Organization**: Snapshots organized by month (YYYY-MM)
- **Immutable Records**: Snapshots represent point-in-time data

### Financial Tracking

- **Income Tracking**: Total income for each month
- **Expense Tracking**: Total expenses for each month
- **Balance Tracking**: Monthly and total balance at snapshot
- **Category Tracking**: Category values preserved at snapshot time

### Data Preservation

- **Complete State**: All category values captured
- **Currency Preservation**: Currency at snapshot time maintained
- **Balance Preservation**: Account balances at snapshot time
- **Historical Context**: Enables comparison across months

## Workflows

### Create Snapshot Flow

1. Month reset operation initiated
2. Month reset orchestrator coordinates snapshot creation
3. Current category values captured
4. Account balances calculated
5. Income and expense totals calculated
6. Monthly balance calculated
7. Snapshot created with all data
8. Snapshot saved to Firestore
9. Snapshot added to state
10. Snapshot visible in UI

### Load Snapshots Flow

1. Component requests snapshots
2. Service checks if already loaded
3. If not loaded, dispatches load action
4. Effect loads from Firestore
5. Snapshots added to state
6. Selectors provide data to component
7. UI displays snapshots

## Dependencies

### External Dependencies

- **Account Domain**: Account balances for snapshots
- **Category Domain**: Category values for snapshots
- **Metadata Domain**: Currency information
- **Month Reset Orchestrator**: Snapshot creation trigger

### Internal Dependencies

- NgRx for state management
- Firestore for data persistence

## Usage Examples

### Getting All Snapshots

```typescript
this.snapshotFacade.getSnapshots().subscribe(snapshots => {
  snapshots.forEach(snapshot => {
    console.log(snapshot.date, snapshot.income, snapshot.expense);
  });
});
```

### Loading Snapshots

```typescript
await this.snapshotFacade.loadSnapshots();
```

### Accessing Snapshot Data

```typescript
this.snapshotFacade.getSnapshots().subscribe(snapshots => {
  const latestSnapshot = snapshots[snapshots.length - 1];
  console.log('Monthly balance:', latestSnapshot.monthBalance);
  console.log('Full balance:', latestSnapshot.fullBalance);
  console.log('Categories count:', latestSnapshot.categories.length);
});
```

### Adding Snapshot

```typescript
const snapshot: Snapshot = {
  date: '2024-01',
  categories: [...],
  income: 5000,
  expense: 3000,
  monthBalance: 2000,
  fullBalance: 10000,
  currency: CurrenciesEnum.USD
};

this.snapshotFacade.addSnapshot(snapshot);
```

## Best Practices

### Snapshot Creation

- Create snapshots during month reset operations
- Capture complete financial state
- Include all category values
- Preserve currency information
- Use consistent date format (YYYY-MM)

### Data Access

- Use facade service for component interactions
- Leverage selectors for snapshot data
- Handle loading states properly
- Cache snapshots to reduce database reads

### Historical Analysis

- Use snapshots for trend analysis
- Compare monthly balances
- Track income and expense patterns
- Analyze category value changes over time

### Performance

- Load snapshots on demand
- Use entity adapter for efficient state management
- Limit snapshot data size
- Archive old snapshots if needed
