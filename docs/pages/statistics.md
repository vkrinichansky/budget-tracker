# Statistics Page

This document describes the Statistics page, which displays historical financial data through monthly snapshots in the SmartExpense application.

## Overview

The Statistics page provides users with a historical view of their financial data through monthly snapshots. It enables users to review past financial performance, track trends, and analyze their financial history over time.

## Route Configuration

**Path**: `/statistics`  
**Guard**: `AuthGuard` (requires authentication)  
**Lazy Loading**: Yes

## Page Structure

```
statistics/
├── statistics.component.ts
├── statistics.component.html
├── statistics.component.scss
└── statistics.module.ts
```

## Component

### StatisticsComponent

**Purpose**: Display historical financial statistics

**Key Responsibilities**:
- Load metadata and snapshots
- Manage loading state
- Display snapshot list
- Handle data initialization

**Lifecycle**:
- `ngOnInit()`: Initialize data and loading state

## Page Layout

### Header Section

- **Page Title**: "Statistics" with translation support

### Content Section

- **Snapshots List**: Display of all monthly snapshots
- Scrollable list for historical data
- Chronological organization

## Initialization Flow

### Data Loading Sequence

1. **Initialize Metadata**:
   - Load user metadata (currency, language)
   - Required for snapshot display formatting

2. **Load Snapshots**:
   - Load all monthly snapshots from Firestore
   - Historical financial data
   - Snapshot state management

3. **Manage Loading State**:
   - Combine metadata and snapshot loading states
   - Display loading indicator until both complete
   - Handle loading completion

### Loading Indicator

- Full-size loader displayed during initialization
- Shown until metadata and snapshots loaded
- Prevents interaction during data loading

## Dependencies

### Domain Dependencies

- **Snapshot Domain**: Monthly snapshot data and display
- **Metadata Domain**: Currency and language for formatting

### UI Dependencies

- **Design System Module**: UI components
- **Translate Module**: Internationalization

## Features

### Historical Data Display

- **Monthly Snapshots**: Complete monthly financial snapshots
- **Chronological Order**: Snapshots organized by date
- **Financial Summary**: Income, expenses, and balances per month
- **Category History**: Category values at snapshot time

### Snapshot Information

Each snapshot displays:
- **Date**: Month and year (YYYY-MM format)
- **Income**: Total income for the month
- **Expenses**: Total expenses for the month
- **Monthly Balance**: Net balance (income - expenses)
- **Full Balance**: Total account balance at snapshot
- **Categories**: All categories with their values at snapshot time
- **Currency**: Currency used at snapshot time

### Data Visualization

- Snapshot summaries
- Financial trends
- Historical comparisons
- Category value changes over time

## Loading States

### Loading Indicator

- Full-size loader during initialization
- Shown until metadata and snapshots loaded
- Prevents interaction during data loading

### Loading Sequence

1. Show loading indicator
2. Load metadata
3. Load snapshots
4. Wait for both to complete
5. Hide loading indicator
6. Display snapshots list

## Data Flow

### Snapshot Loading

1. Component requests snapshots via facade
2. Service checks if already loaded
3. If not, dispatches load action
4. Effect loads from Firestore
5. Snapshots added to NgRx state
6. Selectors provide data to component
7. Component displays snapshots

### Metadata Loading

1. Component requests metadata via facade
2. Service checks if already loaded
3. If not, dispatches load action
4. Effect loads from Firestore
5. Metadata available for formatting

## Error Handling

### Data Loading Errors

- Errors handled at domain level
- Loading states properly managed
- User feedback via snackbars if needed

### Missing Data

- Handles empty snapshot list gracefully
- Shows appropriate empty state
- Maintains application functionality

## Best Practices

### Initialization

- Load required data before displaying
- Handle loading states appropriately
- Wait for all dependencies

### Performance

- Use OnPush change detection
- Lazy load page module
- Optimize snapshot loading
- Efficient data rendering

### User Experience

- Provide clear loading feedback
- Handle empty states gracefully
- Maintain responsive layout
- Support scrollable content

## Usage Examples

### Accessing Statistics Page

```typescript
// Navigate to statistics
this.router.navigate(['/statistics']);

// Requires authentication via AuthGuard
```

### Component Initialization

```typescript
ngOnInit(): void {
  // Load metadata for formatting
  this.metadataFacade.loadMetadata();
  
  // Load snapshots
  this.snapshotFacade.loadSnapshots();
  
  // Initialize loading state
  this.initDataLoading();
}
```

### Loading State Management

```typescript
private initDataLoading(): void {
  this.loading$ = combineLatest([
    this.metadataFacade.metadataLoaded(),
    this.snapshotFacade.snapshotsLoaded(),
  ]).pipe(
    map(([metadataLoaded, snapshotsLoaded]) => 
      !metadataLoaded || !snapshotsLoaded
    )
  );
}
```

## Integration

### SnapshotsListComponent

The page uses the `SnapshotsListComponent` from the Snapshot domain which:
- Displays all monthly snapshots
- Shows snapshot summaries
- Handles snapshot item rendering
- Provides historical data navigation

### Metadata Integration

Metadata is used for:
- Currency formatting in snapshots
- Locale-specific date formatting
- Number formatting based on locale
- Language-specific display
