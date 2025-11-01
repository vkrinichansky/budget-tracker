# Auth Domain

This document describes the Auth domain, which handles user authentication and authorization in the SmartExpense application.

## Overview

The Auth domain is responsible for user authentication, session management, and route protection. It integrates with Firebase Authentication to provide secure user login/logout functionality using Google Sign-In.

## Domain Structure

```
auth/
├── components/          # UI components for authentication
├── guards/             # Route protection guards
├── services/           # Business logic and authentication
│   ├── auth-service/       # Core authentication logic
│   └── auth-facade/        # Public API facade
├── models/             # User entities and events
├── store/              # NgRx state management
└── auth.module.ts      # Domain module definition
```

## User Model

### User Interface

```typescript
interface User {
  uid: string;           // Unique user identifier from Firebase
  email: string;         // User email address
  displayName: string;   // User display name
  photoURL: string;      // User profile photo URL
  isNewUser: boolean;    // Whether this is a new user registration
}
```

### Key Properties

- **uid**: Unique identifier from Firebase Authentication
- **email**: User's email address used for authentication
- **displayName**: User's display name from Google account
- **photoURL**: Profile photo URL from Google account
- **isNewUser**: Flag indicating if this is a first-time login

## Services

### AuthService

**Purpose**: Core authentication logic and state management

**Key Methods**:
- `initAuthState()`: Initialize and check authentication state
- `googleLogin()`: Perform Google Sign-In authentication
- `logOut()`: Sign out the current user
- `setUser()`: Update user state in store
- `getUser()`: Get current user as observable
- `isLoggedIn()`: Check if user is authenticated

### AuthFacadeService

**Purpose**: Public API for components

**Responsibilities**:
- Provides unified interface to components
- Delegates to AuthService
- Exposes authentication methods
- Provides user state queries

## Components

### LoginButtonComponent

**Purpose**: Google Sign-In button component

**Features**:
- Google authentication button
- Loading state management
- Error handling with snackbar notifications
- Navigation to dashboard on success

## Guards

### AuthGuard

**Purpose**: Protect routes that require authentication

**Behavior**:
- Checks if user is logged in
- Allows access if authenticated
- Redirects to auth page if not authenticated

**Usage**:
```typescript
{
  path: 'dashboard',
  canActivate: [AuthGuard],
  component: DashboardComponent
}
```

### SecureInnerPagesGuard

**Purpose**: Protect authentication pages from logged-in users

**Behavior**:
- Returns `true` (allows access) if user is NOT logged in
- Returns `false` (denies access) and redirects to dashboard if user IS already authenticated
- Prevents logged-in users from accessing login/auth pages

**Usage**:
```typescript
{
  path: 'auth',
  canActivate: [SecureInnerPagesGuard],
  component: AuthPageComponent
}
```

## Store (NgRx)

### State Structure

```typescript
interface AuthState {
  user: User | null;     // Current authenticated user
  isLoaded: boolean;     // Authentication state loaded flag
}
```

### Actions

- `login`: Trigger Google Sign-In process
- `setUser`: Initialize user state from Firebase
- `authenticated`: User successfully authenticated
- `notAuthenticated`: User is not authenticated
- `logout`: Trigger user logout process

### Effects

**setUser$**: Listens for setUser action and extracts user from Firebase auth state

**login$**: 
- Sets browser persistence
- Initiates Google Sign-In popup
- Extracts user information
- Handles new user detection
- Emits login success/error events

**logOut$**:
- Signs out from Firebase
- Clears user state
- Emits logout success/error events

### Selectors

- `userSelector`: Get current authenticated user
- `authLoadedSelector`: Check if auth state is loaded

### Reducer

Manages authentication state:
- Stores current user on authentication
- Clears user on logout or not authenticated
- Tracks loading state

## Events

### AuthEvents Enum

```typescript
enum AuthEvents {
  LOGIN = 'Login',
  LOGOUT = 'Logout'
}
```

Events are emitted with status 'success' or 'error' and include error codes on failure.

## Authentication Flow

### Login Flow

1. User clicks login button
2. Component calls `authFacade.googleLogin()`
3. Service dispatches login action
4. Effect sets browser persistence
5. Google Sign-In popup opens
6. User authenticates with Google
7. Effect extracts user information
8. User state updated in store
9. Success event emitted
10. Navigation to dashboard

### Logout Flow

1. User initiates logout
2. Service dispatches logout action
3. Effect signs out from Firebase
4. User state cleared
5. Success event emitted
6. Navigation to auth page

### Initialization Flow

1. Application starts
2. `initAuthState()` called
3. Checks if auth state already loaded
4. If not, dispatches setUser action
5. Effect listens to Firebase auth state
6. Extracts user if authenticated
7. Updates store with user or null
8. Auth state marked as loaded

## Key Features

### Google Authentication

- Google Sign-In integration via Firebase
- OAuth 2.0 authentication flow
- Secure token management
- Automatic session persistence

### Session Management

- Browser local persistence
- Automatic session restoration
- Secure token storage
- Session state tracking

### New User Detection

- Identifies first-time users
- Supports onboarding flows
- Tracks user registration status

### Route Protection

- Guards for protected routes
- Guards for authentication pages
- Automatic redirects
- Secure navigation

## Dependencies

### External Dependencies

- **Firebase Authentication**: Google Sign-In provider
- **Design System**: UI components (buttons, snackbars)
- **Shared Utils**: Event bus and navigation service

### Internal Dependencies

- NgRx for state management
- Angular Firebase for authentication
- RxJS for reactive streams

## Usage Examples

### Initialize Auth State

```typescript
// In app component or app initialization
await this.authFacade.initAuthState();
```

### Check Authentication Status

```typescript
this.authFacade.isLoggedIn().subscribe(isLoggedIn => {
  if (isLoggedIn) {
    // User is authenticated
  }
});
```

### Get Current User

```typescript
this.authFacade.getUser().subscribe(user => {
  if (user) {
    console.log(user.email, user.displayName);
  }
});
```

### Perform Login

```typescript
try {
  await this.authFacade.googleLogin();
  // Login successful
} catch (error) {
  // Handle login error
}
```

### Perform Logout

```typescript
try {
  await this.authFacade.logOut();
  // Logout successful
} catch (error) {
  // Handle logout error
}
```

### Using Route Guards

```typescript
// Protected route
{
  path: 'dashboard',
  canActivate: [AuthGuard],
  component: DashboardComponent
}

// Authentication page (no access if logged in)
{
  path: 'auth',
  canActivate: [SecureInnerPagesGuard],
  component: AuthPageComponent
}
```

## Best Practices

### Initialization

- Always initialize auth state on application startup
- Wait for auth state to load before accessing protected routes
- Handle initialization errors gracefully

### State Management

- Use facade service for component interactions
- Leverage selectors for reactive user state
- Don't directly access Firebase auth in components

### Error Handling

- Handle authentication errors with user-friendly messages
- Provide retry mechanisms for failed logins
- Log authentication errors for debugging

### Security

- Never expose Firebase configuration keys
- Use Firebase security rules for data protection
- Validate user authentication before data operations
- Implement proper session timeout handling

### User Experience

- Show loading states during authentication
- Provide clear error messages
- Handle network connectivity issues
- Support session restoration on page refresh

## Security Considerations

### Authentication Security

- Firebase handles secure token management
- OAuth 2.0 provides secure authentication
- Browser persistence is secure for web apps
- Tokens are automatically refreshed

### Route Protection

- Always use guards for protected routes
- Don't rely only on UI hiding
- Validate authentication server-side when possible
- Clear sensitive data on logout

### Data Security

- User authentication required for all Firestore operations
- Firebase security rules enforce access control
- User ID used for data isolation
- No sensitive data stored client-side
