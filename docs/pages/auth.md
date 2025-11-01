# Auth Page

This document describes the Auth page, which handles user authentication in the SmartExpense application.

## Overview

The Auth page is the entry point for unauthenticated users. It provides a clean, focused interface for Google Sign-In authentication, allowing users to access the application.

## Route Configuration

**Path**: `/auth`  
**Guard**: `SecureInnerPagesGuard` (prevents logged-in users from accessing)  
**Lazy Loading**: Yes

## Page Structure

```
auth/
├── components/
│   └── auth-page/
│       ├── auth-page.component.ts
│       └── auth-page.component.html
└── auth.module.ts
```

## Component

### AuthPageComponent

**Purpose**: Main authentication page component

**Features**:
- Minimalist authentication interface
- Application logo display
- Google Sign-In button integration
- Dark theme styling
- Centered layout design

**Template Structure**:
```html
- Application Logo (SVG icon)
- Login Button Component
```

## Dependencies

### Domain Dependencies

- **Auth Domain**: Provides `LoginButtonComponent` for authentication

### UI Dependencies

- **Design System Module**: UI components and styling

## Layout & Styling

### Design Characteristics

- **Dark Background**: Charcoal background color
- **Centered Layout**: Flexbox centering for logo and button
- **Responsive Design**: Adapts to different screen sizes
- **Minimal Interface**: Focused on authentication action

## User Flow

### Access Flow

1. User navigates to `/auth` route
2. `SecureInnerPagesGuard` checks authentication status
3. If not logged in → Allow access
4. If logged in → Redirect to dashboard
5. Auth page displays login interface

### Authentication Flow

1. User views auth page with logo and login button
2. User clicks Google Sign-In button
3. Google authentication popup opens
4. User authenticates with Google account
5. On success → Redirect to dashboard
6. On error → Display error message

## Key Features

### Secure Access

- Protected by `SecureInnerPagesGuard`
- Prevents logged-in users from accessing
- Automatic redirect for authenticated users

### Simple Interface

- Clean, uncluttered design
- Focused on single action (login)
- Application branding with logo
- Clear call-to-action

### Error Handling

- Login errors handled by `LoginButtonComponent`
- User-friendly error messages
- Snackbar notifications for errors

## Integration

### LoginButtonComponent

The page uses the `LoginButtonComponent` from the Auth domain which:
- Handles Google Sign-In process
- Manages loading states
- Shows error messages
- Navigates to dashboard on success

### Route Guards

- **SecureInnerPagesGuard**: Ensures only unauthenticated users can access
- Prevents unnecessary authentication attempts
- Maintains proper navigation flow

## Best Practices

### User Experience

- Keep interface simple and focused
- Provide clear visual feedback
- Handle errors gracefully
- Maintain consistent branding

### Security

- Use route guards for protection
- Don't expose sensitive information
- Handle authentication errors securely
- Provide secure authentication flow

## Usage Examples

### Accessing Auth Page

Users can navigate to `/auth` or be redirected there when:
- Not authenticated and accessing protected routes
- Explicitly navigating to auth URL
- Session expired

### Authentication Process

```typescript
// Login handled by LoginButtonComponent
// On successful login:
// - User authenticated via Firebase
// - User redirected to dashboard
// - Session established
```
