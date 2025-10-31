# How to Start Project

This guide will help you set up and run the SmartExpense application on your local development environment.

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (version 18 or higher)
- **NPM** (comes with Node.js)
- **Git** (for version control)
- **Firebase CLI** (for deployment)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd budget-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Global Dependencies

```bash
# Install Firebase CLI globally
npm install -g firebase-tools

# Install Docsify CLI globally (for documentation)
npm install -g docsify-cli
```

## Development Setup

### 1. Start Development Server

```bash
# Start Angular development server
npm start
```

The application will be available at `http://localhost:4200`

### 2. Start Documentation Server

```bash
# In a separate terminal, start documentation
npm run docsify
```

The documentation will be available at `http://localhost:3000`

### 3. Build SVG Sprites (if needed)

```bash
# Build SVG sprites from individual icons
npm run "build sprites"
```

## Firebase Configuration

### 1. Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase project (if not already done)
firebase init
```

### 2. Environment Configuration

Create environment files in `src/environments/`:

**environment.ts** (Development)
```typescript
export const environment = {
  production: false,
  firebase: {
    // Your Firebase config
  }
};
```

**environment.prod.ts** (Production)
```typescript
export const environment = {
  production: true,
  firebase: {
    // Your Firebase config
  }
};
```

### 3. Firebase Project Switching

```bash
# Switch to development environment
npm run "use dev"

# Switch to production environment
npm run "use prod"
```

## Development Workflow

### 1. Code Quality Checks

```bash
# Run ESLint
npm run lint

# Run Stylelint for SCSS
npm run lint:styles

# Run tests
npm test
```

### 2. Building the Application

```bash
# Build for development
npm run "build for dev"

# Build for production
npm run "build for prod"
```

### 3. Deployment

```bash
# Deploy to Firebase Hosting
npm run deploy
```

## Project Structure

```
src/
├── app/
│   ├── domains/           # Domain modules
│   ├── orchestrators/     # Business workflow orchestrators
│   ├── pages/            # Application pages
│   └── shared/            # Shared components and utilities
├── assets/               # Static assets
├── environments/         # Environment configurations
└── styles.scss          # Global styles
```

## Common Issues

### Port Already in Use

If port 4200 is already in use:

```bash
# Kill process on port 4200
npx kill-port 4200

# Or start on different port
ng serve --port 4201
```

### Firebase Authentication Issues

1. Ensure Firebase project is properly configured
2. Check environment files for correct Firebase config
3. Verify Firebase rules are set up correctly

### Build Errors

1. Clear node_modules and reinstall:
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. Clear Angular cache:
   ```bash
   ng cache clean
   ```

## Development Tips

### 1. Hot Reload

The development server supports hot reload. Changes to TypeScript, HTML, and SCSS files will automatically refresh the browser.

### 2. Debugging

- Use Angular DevTools browser extension
- Enable NgRx DevTools for state debugging
- Use browser developer tools for network and performance debugging

### 3. Code Organization

- Follow the domain-driven design structure
- Use Angular CLI generators for new components
- Maintain consistent naming conventions

## Next Steps

1. **Explore the Codebase**: Start with the overview and domain documentation
2. **Understand the Architecture**: Read about DDD patterns and orchestrators
3. **Set Up Firebase**: Configure your Firebase project and environment
4. **Start Development**: Begin with small features and gradually work on larger ones

## Getting Help

- Check the documentation in the `docs/` folder
- Review the codebase structure and patterns
- Use Angular CLI help: `ng help`
- Check Firebase documentation for backend setup
