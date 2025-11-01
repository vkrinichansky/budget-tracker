# Design System

This document describes the Design System module, which provides a comprehensive library of reusable UI components, directives, pipes, and services for the SmartExpense application.

## Overview

The Design System module is a shared component library that provides consistent UI components, styling, and interaction patterns across the application. It ensures a cohesive user experience and promotes code reusability.

## Module Structure

```
design-system/
├── components/          # UI components
├── directives/          # Custom directives
├── pipes/              # Data transformation pipes
├── services/           # Design system services
├── models/             # Type definitions
├── helpers/            # Utility functions
└── design-system.module.ts
```

## Components

### Core Components

#### ButtonComponent
Standard button component with different types (primary, secondary, active, inherit) and sizes.

#### SvgIconComponent
Displays SVG icons from the application's icon system with configurable sizes.

#### LoaderComponent
Loading spinner for indicating asynchronous operations.

#### FullsizeLoaderComponent
Full-screen loading overlay for page-level loading states.

#### InfoCardComponent
Card component for displaying informational content.

#### PageHeaderComponent
Page header component with title and optional actions.

#### MenuComponent
Context menu component for action lists.

#### SnackbarComponent
Notification component for user feedback (messages and errors).

#### ProgressBarComponent
Progress indicator component.

### Form Controls

#### CustomInputComponent
Custom text input with validation and styling.

#### CustomTextareaComponent
Custom textarea with validation support.

#### CustomSelectComponent
Custom select dropdown component.

#### CheckboxComponent
Checkbox input component.

#### ColorPickerComponent
Color selection component for category/account customization.

#### ControlLabelComponent
Form control label component.

#### ControlErrorComponent
Form validation error display component.

#### CharCounterComponent
Character counter for text inputs.

### Modal Components

#### BaseModalComponent
Base modal component with common modal functionality.

#### ConfirmationModalComponent
Confirmation dialog for user actions (delete, confirm operations).

### UI Components

#### InfoIconComponent
Information icon with tooltip support.

#### CustomTooltipComponent
Custom tooltip component for additional information.

#### ButtonToggleComponent
Toggle button component for switching between states.

## Directives

### PreventInvalidCharsDirective
Prevents invalid characters from being entered in input fields.

### TooltipRendererDirective
Directive for rendering custom tooltips on elements.

## Pipes

### NumberSpacePipe
Adds spacing to numbers for better readability (e.g., 1000 → "1 000").

### ClassToHexColorPipe
Converts CSS class names to hex color values.

## Services

### SnackbarHandlerService

**Purpose**: Manages snackbar notifications

**Methods**:
- `showMessageSnackbar(message)`: Display informational message
- `showErrorSnackbar(error)`: Display error message

### ConfirmationModalService

**Purpose**: Manages confirmation dialogs

**Methods**:
- Opens confirmation modals for user actions
- Handles confirmation and cancellation

## Models

### MainPalette

Color palette enum defining the application's main colors:
- White, DirtyWhite, Grey
- LightBlue, Blue, Charcoal
- Green, DarkGreen, DarkRed, Yellow

### ButtonType

Button type definitions:
- `primary`: Primary action button
- `secondary`: Secondary action button
- `active`: Active state button
- `inherit`: Inherit styles from parent

### IconsForUser

Array of available icon identifiers for user selection (categories, accounts).

### Additional Models

- `MenuAction`: Menu action configuration
- `SnackbarData`: Snackbar content data
- `ConfirmationModalData`: Confirmation dialog data
- `ProgressBarModel`: Progress bar configuration
- `ApexChartConfig`: Chart configuration for ApexCharts
- `Tooltip`: Tooltip configuration
- `OverlayFadeAnimation`: Modal animation configuration

## Helpers

### Screen Resolution

Helper functions for responsive design:
- Mobile width detection
- Screen size utilities

## Key Features

### Consistent Styling

- Unified color palette
- Consistent component styling
- Responsive design support

### Form Controls

- Validation support
- Error handling
- Custom styling
- Accessibility features

### User Feedback

- Snackbar notifications
- Confirmation dialogs
- Loading indicators
- Progress bars

### Accessibility

- ARIA labels
- Keyboard navigation
- Screen reader support
- Focus management

## Usage Examples

### Using Button Component

```html
<app-button [type]="'primary'" (click)="handleClick()">
  Click Me
</app-button>
```

### Using SvgIcon Component

```html
<app-svg-icon [iconName]="'home'" [iconSize]="24"></app-svg-icon>
```

### Showing Snackbar

```typescript
this.snackbarHandler.showMessageSnackbar('Operation successful');
this.snackbarHandler.showErrorSnackbar('Operation failed');
```

### Opening Confirmation Modal

```typescript
this.confirmationModal.openConfirmationModal({
  questionTranslationKey: 'confirm.delete',
  onConfirm: () => this.deleteItem()
});
```

### Using Form Controls

```html
<app-custom-input
  [formControl]="nameControl"
  [label]="'Name'"
></app-custom-input>

<app-control-error [control]="nameControl"></app-control-error>
```

## Best Practices

### Component Usage

- Use design system components consistently
- Follow component API patterns
- Leverage component customization options
- Use appropriate component types

### Styling

- Use MainPalette colors
- Follow responsive design patterns
- Maintain consistency across components
- Test on different screen sizes

### User Feedback

- Use snackbars for temporary notifications
- Use confirmation modals for destructive actions
- Show loading states during async operations
- Provide clear error messages

### Accessibility

- Always provide labels for form controls
- Ensure keyboard navigation works
- Test with screen readers
- Maintain focus management
