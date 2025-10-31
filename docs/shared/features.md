# Shared Features

This document describes the Shared Features module, which provides application-wide feature components used across multiple pages.

## Overview

The Shared Features module contains reusable feature components that are used in multiple parts of the application. These components implement common application features like navigation.

## Module Structure

```
features/
└── navigation-bar/
    ├── components/
    ├── models/
    └── navigation-bar.module.ts
```

## Navigation Bar Feature

### NavigationBarComponent

**Purpose**: Application navigation bar component

**Features**:
- Main navigation menu
- Navigation items with icons
- Tooltips for navigation items
- Active route highlighting
- User logout functionality

### NavigationBarItemComponent

**Purpose**: Individual navigation bar item

**Features**:
- Icon display
- Router link navigation
- Tooltip support
- Active state indication

### NavigationBarItem Model

```typescript
interface NavigationBarItem {
  routerLink: string;              // Route path
  iconName: string;                // Icon identifier
  tooltipTranslationKey: string;   // Tooltip translation key
}
```

## Navigation Items

### Default Navigation Items

The navigation bar includes:
- **Dashboard**: Home/dashboard navigation
- **Statistics**: Statistics page navigation

### Navigation Features

- Router-based navigation
- Icon indicators
- Tooltip descriptions
- Active route highlighting
- Responsive design

## Dependencies

### External Dependencies

- **Auth Domain**: User authentication and logout
- **Design System**: UI components (menu, snackbar, confirmation modal)
- **Shared Utils**: Navigation service and error handling
- **Shared Models**: AppRoutes enum

### Internal Dependencies

- Angular Router for navigation
- Angular Material for UI components

## Usage Examples

### Using Navigation Bar

```html
<app-navigation-bar></app-navigation-bar>
```

### Navigation Items Configuration

The navigation items are configured in the component:

```typescript
readonly navigationBarItems: NavigationBarItem[] = [
  {
    iconName: 'home',
    tooltipTranslationKey: 'navigationBar.itemTooltip.home',
    routerLink: `/${AppRoutes.Dashboard}`,
  },
  {
    iconName: 'statistics',
    tooltipTranslationKey: 'navigationBar.itemTooltip.statistics',
    routerLink: `/${AppRoutes.Statistics}`,
  },
];
```

## Key Features

### Router Integration

- Uses Angular Router for navigation
- Active route detection
- Route parameter support

### User Actions

- Logout functionality
- User authentication state
- Confirmation dialogs for actions

### Responsive Design

- Adapts to different screen sizes
- Mobile-friendly navigation
- Touch-friendly interface

## Best Practices

### Navigation

- Keep navigation items consistent
- Use appropriate icons
- Provide clear tooltips
- Handle active states properly

### User Experience

- Make logout easily accessible
- Provide confirmation for destructive actions
- Show appropriate feedback
- Maintain navigation state
