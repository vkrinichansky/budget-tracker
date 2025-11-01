# SmartExpense Developer Overview

**SmartExpense** is an Angular application implementing Domain-Driven Design patterns for personal finance management.

## 🏗️ Technology Stack
- **Angular** + TypeScript
- **NgRx** for state management
- **Firebase** (Firestore, Auth, Hosting)
- **Angular Material** + **Tailwind CSS**
- **ApexCharts** for data visualization
- **Angular i18n** (en-US, uk-UA)

## 🏢 Domains
Self-contained modules that organize related business logic, components, services, and state management. Each domain handles specific aspects like financial account management, budget categorization, transaction tracking, authentication, system configuration, and monthly snapshots.

## 🎭 Orchestrators
Services that coordinate complex business workflows by managing multiple domain interactions and ensuring data consistency across the application.

## 🎨 Design System
- Reusable UI components
- Design system types
- Design system utilities
- SCSS architecture

## 📚 Documentation Sections
- **Technical Information** - Setup and development guides
- **Architecture** - System design patterns
- **Domains** - Business logic implementation
- **Orchestrators** - Complex workflow management
- **Pages** - User interface documentation
- **Shared Modules** - Reusable components and utilities