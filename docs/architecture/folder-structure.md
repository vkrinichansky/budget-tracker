# Folder Structure

This document outlines the high-level folder structure of the SmartExpense application, providing an overview of how the codebase is organized.

## `src/app` Directory

The main application logic resides within the `src/app` directory, which is structured to promote modularity and maintainability.

```
src/app/
├── domains/            # Self-contained modules for core business logic
├── orchestrators/       # Services coordinating complex business workflows
├── pages/              # Top-level components representing application views
├── shared/             # Reusable components, utilities, and design system
├── app-routing.module.ts # Main application routing module
├── app.component.html    # Root component HTML template
├── app.component.scss    # Root component styles
├── app.component.spec.ts # Root component unit tests
├── app.component.ts      # Root component TypeScript logic
└── app.module.ts         # Main application module
```

## Key Directories Explained

### `domains/`
This directory contains feature-specific modules, each representing a core business domain. Each domain encapsulates its own components, services, models, and state management (NgRx store). This aligns with Domain-Driven Design principles, ensuring clear separation of concerns and high cohesion within each business area.

**Structure**:
```
domains/
├── account/          # Financial account management
├── category/         # Budget categorization
├── activity-log/     # Transaction tracking
├── auth/            # Authentication & authorization
├── metadata/        # System configuration
└── snapshot/        # Monthly financial snapshots
```

### `orchestrators/`
This directory houses services responsible for orchestrating complex business workflows that often span multiple domains. Orchestrators manage the sequence of operations, handle cross-domain communication, and ensure data consistency.

**Structure**:
```
orchestrators/
├── category-transaction-orchestrator/
├── currency-change-orchestrator/
├── edit-account-value-orchestrator/
├── month-reset-orchestrator/
├── move-money-between-accounts-orchestrator/
├── remove-activity-log-record-orchestrator/
└── utils/           # Base orchestrator services
```

### `pages/`
This directory contains the top-level components that serve as entry points for different application views or routes. These components typically compose smaller, reusable components from the `shared` or `domains` directories.

**Structure**:
```
pages/
├── auth/            # Authentication pages
├── dashboard/       # Main dashboard page
└── statistics/      # Statistics and analytics page
```

### `shared/`
This directory is for application-wide reusable assets, including common UI components (design system), utility services, directives, pipes, and interfaces that are not specific to any single domain or feature.

**Structure**:
```
shared/
├── design-system/   # Reusable UI components and design tokens
├── features/        # Shared feature components
├── models/          # Shared data models and interfaces
└── utils/           # Utility services and helpers
```

## Core Application Files

### `app.module.ts`
The main application module that imports and configures all feature modules, services, and dependencies.

### `app-routing.module.ts`
The main routing module that defines the application's navigation structure and route guards.

### `app.component.*`
The root component files that define the main application shell and layout structure.

## Architecture Benefits

### Modularity
- Clear separation between business domains
- Self-contained modules with minimal dependencies
- Easy to add, remove, or modify features

### Scalability
- New domains can be added without affecting existing ones
- Shared components promote code reuse
- Orchestrators handle complex cross-domain workflows

### Maintainability
- Logical organization makes code easy to find
- Clear boundaries between different concerns
- Consistent patterns across the application

### Testability
- Isolated modules are easier to test
- Clear dependencies make mocking straightforward
- Domain-specific tests are focused and relevant

## Development Guidelines

### Adding New Features
1. Determine if it belongs to an existing domain or needs a new one
2. Create components in the appropriate domain
3. Add shared components to the `shared` directory
4. Use orchestrators for complex cross-domain workflows

### Code Organization
- Keep domain logic within domain boundaries
- Use shared components for common UI patterns
- Leverage orchestrators for complex business workflows
- Maintain consistent file naming and structure

### Best Practices
- Follow the established folder structure
- Use barrel exports (index.ts) for clean imports
- Keep components focused and single-purpose
- Document complex business logic and workflows
