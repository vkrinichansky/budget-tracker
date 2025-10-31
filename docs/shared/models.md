# Shared Models

This document describes the Shared Models module, which provides common type definitions and enums used across the application.

## Overview

The Shared Models module contains application-wide type definitions, enums, and constants that are used across multiple domains and features.

## Models

### BudgetType Enum

**Purpose**: Defines budget category types

```typescript
enum BudgetType {
  Income = 'income',
  Expense = 'expense'
}
```

**Usage**:
- Category classification
- Budget type filtering
- Income/expense distinction
- Category operations

### AppRoutes Enum

**Purpose**: Defines application route paths

```typescript
enum AppRoutes {
  Auth = 'auth',
  Dashboard = 'dashboard',
  Statistics = 'statistics'
}
```

**Usage**:
- Route definitions
- Navigation links
- Route guards
- Router configuration

## Key Features

### Type Safety

- Strongly typed enums
- Consistent usage across application
- Compile-time type checking
- IDE autocomplete support

### Centralized Definitions

- Single source of truth for routes
- Consistent budget type handling
- Easy to maintain and update

## Usage Examples

### Using BudgetType

```typescript
// Filter categories by type
const incomeCategories = categories.filter(
  cat => cat.budgetType === BudgetType.Income
);

// Check budget type
if (category.budgetType === BudgetType.Expense) {
  // Handle expense category
}
```

### Using AppRoutes

```typescript
// Navigate to dashboard
this.router.navigate([AppRoutes.Dashboard]);

// Check current route
if (this.route.path === AppRoutes.Statistics) {
  // Handle statistics page
}

// Use in navigation items
const navItem = {
  routerLink: `/${AppRoutes.Dashboard}`,
  // ...
};
```

## Best Practices

### Enum Usage

- Always use enums instead of string literals
- Import from shared models module
- Use enum values consistently
- Document enum purposes

### Route Management

- Use AppRoutes for all route references
- Keep routes centralized
- Update routes in one place
- Use route constants in guards
