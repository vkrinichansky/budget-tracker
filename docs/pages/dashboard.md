# Dashboard Page

This document describes the Dashboard page, which serves as the main application interface for authenticated users in the SmartExpense application.

## Overview

The Dashboard page is the primary view after user authentication. It displays financial overview information, account details, category management, and activity log, providing users with a comprehensive view of their financial status.

## Route Configuration

**Path**: `/dashboard`  
**Guard**: `AuthGuard` (requires authentication)  
**Lazy Loading**: Yes  
**Default Route**: Redirects from root path

## Page Structure

```
dashboard/
├── dashboard.component.ts
├── dashboard.component.html
├── dashboard.component.scss
├── dashboard.module.ts
└── dashboard-orchestrator-config/
    ├── dashboard-orchestrator-manager.service.ts
    └── dashboard-orchestrator-config.module.ts
```

## Component

### DashboardComponent

**Purpose**: Main dashboard page component

**Key Responsibilities**:
- Initialize all domain data
- Coordinate data loading
- Manage orchestrator lifecycle
- Handle month reset operations
- Display loading state

**Lifecycle**:
- `ngOnInit()`: Initialize data and orchestrators
- `ngOnDestroy()`: Clean up orchestrators

## Page Layout

### Header Section

- **Page Title**: "Dashboard" with translation support
- **Currency Switcher**: Change display currency
- **Language Switcher**: Change application language

### Info Cards Section

Displays key financial metrics:

1. **Income Info Card**: Total income value
2. **Expense Info Card**: Total expense value
3. **Current Month Balance Card**: Monthly balance (income - expenses)
4. **Full Balance Info Card**: Total account balance across all accounts
5. **Accounts Info Card**: Account summary information

### Main Cards Section

Main content areas:

1. **Income Categories**: Income category management and display
2. **Expense Categories**: Expense category management and display
3. **Activity Log**: Recent transaction history

## Initialization Flow

### Data Loading Sequence

1. **Initialize Domains**:
   - Load metadata (currency, language, reset date)
   - Load accounts
   - Load categories
   - Load activity log

2. **Wait for All Data**:
   - Combine loading states from all domains
   - Display loading indicator until all data loaded
   - Handle loading completion

3. **Initialize Orchestrators**:
   - Start dashboard orchestrator manager
   - Activate all business workflow orchestrators

4. **Check Month Reset**:
   - Check if month reset is needed
   - Execute reset if required
   - Show notification if snapshot created

### Orchestrator Management

The dashboard manages orchestrators via `DashboardOrchestratorManagerService`:

- **Currency Change Orchestrator**: Handles currency switching
- **Move Money Between Accounts Orchestrator**: Handles transfers
- **Reset Categories Orchestrator**: Handles category resets
- **Category Transaction Orchestrator**: Handles category transactions
- **Remove Activity Log Record Orchestrator**: Handles record removal
- **Edit Account Value Orchestrator**: Handles account value edits

All orchestrators are initialized on page load and destroyed on page unload.

## Dependencies

### Domain Dependencies

- **Account Domain**: Account management and balance display
- **Category Domain**: Category management and summaries
- **Activity Log Domain**: Transaction history
- **Metadata Domain**: Currency and language settings

### Orchestrator Dependencies

- Month Reset Orchestrator (for automatic resets)
- All dashboard orchestrators (via manager)

### UI Dependencies

- **Design System Module**: UI components
- **Translate Module**: Internationalization

## Features

### Financial Overview

- Real-time financial metrics
- Multi-currency support
- Current month tracking
- Account balance aggregation

### Category Management

- Income and expense categories
- Category value tracking
- Category creation and management
- Category transactions

### Activity Tracking

- Recent transaction display
- Activity log filtering
- Transaction history
- Activity record management

### User Preferences

- Currency switching
- Language switching
- Preferences persist across sessions

### Automatic Operations

- Month reset detection
- Automatic snapshot creation
- Category reset coordination

## Loading States

### Loading Indicator

- Full-size loader displayed during initialization
- Shown until all domain data loaded
- Prevents interaction during data loading

### Loading Sequence

1. Show loading indicator
2. Load metadata
3. Load accounts
4. Load categories
5. Load activity log
6. Wait for all to complete
7. Check month reset
8. Hide loading indicator

## Error Handling

### Data Loading Errors

- Errors handled at domain level
- Loading states properly managed
- User feedback provided via snackbars

### Month Reset Errors

- Reset failures caught and displayed
- Error messages shown to user
- Application remains functional

## Best Practices

### Initialization

- Load all required data before displaying
- Initialize orchestrators properly
- Handle loading states appropriately
- Check for automatic operations

### Performance

- Use OnPush change detection
- Lazy load page module
- Optimize data loading
- Manage orchestrator lifecycle

### User Experience

- Provide clear loading feedback
- Handle errors gracefully
- Maintain responsive layout
- Support all screen sizes

## Usage Examples

### Accessing Dashboard

```typescript
// Navigate to dashboard
this.router.navigate(['/dashboard']);

// Dashboard is default route, so root path redirects here
// Requires authentication via AuthGuard
```

### Component Initialization

```typescript
ngOnInit(): void {
  // Initialize data from all domains
  this.initData();
  
  // Wait for all data to load
  this.initDataLoading();
  
  // Start orchestrators
  this.dashboardOrchestratorManagerService.init();
}
```

### Cleanup

```typescript
ngOnDestroy(): void {
  // Clean up orchestrators
  this.dashboardOrchestratorManagerService.destroyAll();
}
```
