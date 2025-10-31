# Category Domain

This document describes the Category domain, which manages budget categories for income and expenses in the SmartExpense application.

## Overview

The Category domain is responsible for managing budget categories, tracking category values, calculating income and expense totals, and handling category-related operations including creation, deletion, and reset operations.

## Domain Structure

```
category/
├── components/          # UI components for category management
├── services/           # Business logic and data access
│   ├── category-service/     # Core business logic
│   ├── category-api-service/ # Firestore data access
│   ├── category-facade/      # Public API facade
│   └── category-modal-service/ # Modal management
├── models/             # Category entities and events
├── store/              # NgRx state management
└── category.module.ts  # Domain module definition
```

## Category Model

### Category Interface

```typescript
interface Category {
  id: string;           // Unique category identifier
  name: string;         // Category name
  icon: string;         // Category icon identifier
  value: number;        // Current category balance
  budgetType: BudgetType; // Income or Expense
  hexColor: string;     // Category color (hex)
  isSystem: boolean;    // Whether category is system-defined
}
```

### System Categories

The domain includes predefined system categories:

- **incomeAdjustmentCategory**: System category for income adjustments
- **expenseAdjustmentCategory**: System category for expense adjustments

These categories are automatically created and cannot be removed by users.

## Services

### CategoryService

**Purpose**: Core business logic and state management

**Key Methods**:
- `getAllCategories()`: Get all categories
- `getCategoriesByType(budgetType)`: Get categories filtered by budget type
- `getCategoryById(categoryId)`: Get specific category
- `getIncomeValue()`: Calculate total income from all income categories
- `getExpenseValue()`: Calculate total expenses from all expense categories
- `getCurrentMonthBalance()`: Calculate balance (income - expenses)
- `areCategoriesAllReset(budgetType)`: Check if all categories of type are reset (value = 0)
- `addCategory(category)`: Add new category
- `removeCategory(categoryId)`: Remove category
- `runResetCategoriesFlow(budgetType)`: Trigger category reset workflow

### CategoryApiService

**Purpose**: Firestore database operations

**Key Methods**:
- `loadCategories()`: Load all categories from Firestore
- `addCategory()`: Save new category to Firestore
- `removeCategory()`: Delete category from Firestore

### CategoryFacadeService

**Purpose**: Public API for components

### CategoryModalService

**Purpose**: Modal dialog management

**Methods**:
- `openAddCategoryModal(budgetType)`: Open add category form modal

## Components

### CategoriesComponent

**Purpose**: Main categories display component

**Features**:
- Displays income and expense categories
- Category creation and management
- Category value display
- Virtual scrolling for performance

### CategoryItemComponent

**Purpose**: Display individual category item

**Features**:
- Category name, icon, and color
- Category value display
- Context menu with actions
- Transaction initiation

### AddCategoryModalComponent

**Purpose**: Create new category

**Features**:
- Category name input
- Icon selection
- Color picker
- Budget type selection (Income/Expense)

### IncomeInfoCardComponent

**Purpose**: Display income summary information

**Features**:
- Total income value
- Income categories overview
- Visual summary card

### ExpenseInfoCardComponent

**Purpose**: Display expense summary information

**Features**:
- Total expense value
- Expense categories overview
- Visual summary card

### CurrentMonthBalanceInfoCardComponent

**Purpose**: Display current month balance

**Features**:
- Calculated balance (income - expenses)
- Visual balance indicator
- Balance summary information

## Store (NgRx)

### State Structure

```typescript
interface CategoryState {
  categories: EntityState<Category>;
  isLoaded: boolean;
}
```

### Actions

- `loadCategories`: Trigger category loading
- `categoriesLoaded`: Categories loaded from database
- `addCategory`: Add new category
- `categoryAdded`: Category successfully added
- `removeCategory`: Remove category
- `categoryRemoved`: Category successfully removed
- `categoriesUpdated`: Update category values
- `cleanState`: Clear category state

### Effects

**loadCategories$**: Loads categories from Firestore via API service

**addCategory$**: Saves category to Firestore, updates state, and emits success event

**removeCategory$**: Deletes category from Firestore, updates state, and emits success event

### Selectors

- `allCategoriesSelector`: Get all categories
- `selectCategoryByIdSelector(categoryId)`: Get specific category by ID
- `categoriesByTypeSelector(budgetType)`: Get categories filtered by budget type
- `incomeValueSelector`: Calculate total income value
- `expenseValueSelector`: Calculate total expense value
- `currentMonthBalanceSelector`: Calculate current month balance
- `areCategoriesAllResetSelector(budgetType)`: Check if all categories are reset
- `categoriesLoadedSelector`: Check if categories are loaded

### Reducer

Uses NgRx Entity Adapter for efficient state management:
- Handles entity operations (add, remove, update)
- Tracks loading state
- Supports batch updates

## Events

### CategoryEvents Enum

```typescript
enum CategoryEvents {
  CREATE_CATEGORY = 'Create category',
  REMOVE_CATEGORY = 'Remove category',
  RESET_CATEGORIES_START = 'Reset categories start',
  RESET_CATEGORIES_FINISH = 'Reset categories finish',
  OPEN_CATEGORY_TRANSACTION_MODAL = 'Open category transaction modal'
}
```

### Event Interfaces

```typescript
interface ResetCategoriesEvent {
  budgetType: BudgetType;
}

interface OpenCategoryTransactionModalEvent {
  categoryId: string;
}
```

## Key Features

### Budget Types

Categories are organized by budget type:
- **Income**: Categories for tracking income sources
- **Expense**: Categories for tracking expenses

### Category Customization

- Custom icons for visual identification
- Customizable colors (hex color codes)
- User-defined category names
- System categories that cannot be removed

### Value Tracking

- Individual category values
- Total income calculation
- Total expense calculation
- Current month balance calculation

### Reset Functionality

- Categories can be reset to zero
- Reset can be done by budget type
- Reset operations trigger orchestrators
- Reset creates activity log records

## Workflows

### Add Category Flow

1. User opens add category modal
2. Selects budget type (Income/Expense)
3. Fills in category details (name, icon, color)
4. CategoryService adds category
5. CategoryApiService saves to Firestore
6. State updates via NgRx actions
7. Success event emitted
8. UI updates with new category

### Remove Category Flow

1. User confirms category removal
2. CategoryService removes category
3. CategoryApiService deletes from Firestore
4. State updates removing category
5. Success event emitted
6. UI updates removing category

### Reset Categories Flow

1. User initiates category reset
2. Confirmation modal displayed
3. Reset event emitted
4. Orchestrator coordinates reset workflow
5. All category values set to zero
6. Activity log records created
7. Success event emitted
8. UI updates showing reset categories

## Dependencies

### External Dependencies

- **Account Domain**: Account information for transactions
- **Activity Log Domain**: Transaction logging
- **Metadata Domain**: Currency information
- **Design System**: UI components and modals
- **Shared Utils**: Event bus and utilities

### Internal Dependencies

- NgRx for state management
- Angular CDK Scrolling for virtual scrolling
- Reactive Forms for category forms
- ApexCharts for visualizations

## Usage Examples

### Getting All Categories

```typescript
this.categoryFacade.getAllCategories().subscribe(categories => {
  // Use categories
});
```

### Getting Categories by Type

```typescript
this.categoryFacade.getCategoriesByType(BudgetType.Income).subscribe(incomeCategories => {
  // Use income categories
});
```

### Adding New Category

```typescript
const newCategory: Category = {
  id: generateId(),
  name: 'Groceries',
  icon: 'shopping-cart',
  value: 0,
  budgetType: BudgetType.Expense,
  hexColor: '#4CAF50',
  isSystem: false
};

await this.categoryFacade.addCategory(newCategory);
```

### Getting Current Month Balance

```typescript
this.categoryFacade.getCurrentMonthBalance().subscribe(balance => {
  console.log('Current balance:', balance);
});
```

## Best Practices

### Category Management

- Use descriptive category names
- Choose appropriate icons for quick recognition
- Use distinct colors for visual separation
- Don't delete system categories

### State Management

- Always use facade service for component interactions
- Leverage selectors for computed values
- Use effects for async operations
- Handle loading and error states properly

### Calculations

- Use selectors for value calculations
- Cache computed values appropriately
- Handle zero values gracefully
- Validate category values before operations
