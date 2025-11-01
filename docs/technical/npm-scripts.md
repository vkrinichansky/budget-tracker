# NPM Scripts

This document describes all available NPM scripts for the SmartExpense application.

## Development Scripts

### `npm start`
- **Command**: `ng serve`
- **Description**: Starts the development server
- **Usage**: `npm start`
- **Port**: Default Angular dev server port (usually 4200)

### `npm run "start with open"`
- **Command**: `ng serve -o`
- **Description**: Starts the development server and automatically opens the browser
- **Usage**: `npm run "start with open"`
- **Port**: Default Angular dev server port (usually 4200)

### `npm run docsify`
- **Command**: `docsify serve docs`
- **Description**: Serves the documentation using Docsify
- **Usage**: `npm run docsify`
- **Port**: Default Docsify port (usually 3000)

## Build Scripts

### `npm run "build for dev"`
- **Command**: `ng build --configuration development`
- **Description**: Builds the application for development environment
- **Usage**: `npm run "build for dev"`
- **Output**: `dist/` directory with development build

### `npm run "build for prod"`
- **Command**: `ng build --configuration production`
- **Description**: Builds the application for production environment
- **Usage**: `npm run "build for prod"`
- **Output**: `dist/` directory with optimized production build

### `npm run "build sprites"`
- **Command**: `svg-sprite --config sprite-config.json src/assets/svg-icons/**/*.svg`
- **Description**: Builds SVG sprite from individual SVG icons
- **Usage**: `npm run "build sprites"`
- **Output**: Generated sprite file for optimized icon delivery

## Firebase Scripts

### `npm run "use dev"`
- **Command**: `firebase use develop`
- **Description**: Switches Firebase project to development environment
- **Usage**: `npm run "use dev"`
- **Note**: Requires Firebase CLI and proper project configuration

### `npm run "use prod"`
- **Command**: `firebase use production`
- **Description**: Switches Firebase project to production environment
- **Usage**: `npm run "use prod"`
- **Note**: Requires Firebase CLI and proper project configuration

### `npm run deploy`
- **Command**: `firebase deploy`
- **Description**: Deploys the application to Firebase Hosting
- **Usage**: `npm run deploy`
- **Note**: Requires Firebase CLI and proper project configuration

## Testing Scripts

### `npm test`
- **Command**: `ng test`
- **Description**: Runs unit tests using Jasmine and Karma
- **Usage**: `npm test`
- **Coverage**: Generates test coverage reports

## Code Quality Scripts

### `npm run lint`
- **Command**: `ng lint`
- **Description**: Runs ESLint to check code quality and style
- **Usage**: `npm run lint`
- **Configuration**: Uses Angular ESLint configuration

### `npm run lint:styles`
- **Command**: `stylelint "src/**/*.scss"`
- **Description**: Runs Stylelint to check SCSS code quality and style
- **Usage**: `npm run lint:styles`
- **Configuration**: Uses Stylelint with Tailwind CSS configuration

## Utility Scripts

### `npm run ng`
- **Command**: `ng`
- **Description**: Provides access to Angular CLI commands
- **Usage**: `npm run ng <command>`
- **Examples**: 
  - `npm run ng generate component my-component`
  - `npm run ng generate service my-service`

## Common Workflows

### Development Workflow
```bash
# Start development server
npm start

# Run in another terminal for documentation
npm run docsify
```

### Build and Deploy Workflow
```bash
# Build for production
npm run "build for prod"

# Switch to production Firebase project
npm run "use prod"

# Deploy to production
npm run deploy
```

### Code Quality Workflow
```bash
# Check TypeScript/JavaScript code
npm run lint

# Check SCSS styles
npm run lint:styles

# Run tests
npm test
```

### Icon Management Workflow
```bash
# After adding new SVG icons, rebuild sprite
npm run "build sprites"
```

## Script Dependencies

### Required Tools
- **Node.js**: JavaScript runtime
- **NPM**: Package manager
- **Angular CLI**: Angular development tools
- **Firebase CLI**: Firebase deployment tools
- **Docsify**: Documentation server

### Installation
```bash
# Install project dependencies
npm install

# Install Firebase CLI globally
npm install -g firebase-tools

# Install Docsify globally
npm install -g docsify-cli
```
