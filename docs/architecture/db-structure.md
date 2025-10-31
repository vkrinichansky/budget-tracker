# Database Structure

This document describes the Firestore database structure used in the SmartExpense application.

## Overview

The application uses Firebase Firestore as the primary database, organized into collections that align with the domain-driven design architecture.

## Collections

### Accounts Collection

**Path**: `/accounts`

Stores financial account information including name, balance, currency, and account type.

### Activity Log Collection

**Path**: `/activityLog`

Tracks all financial transactions and activities with references to accounts and categories.

### Categories Collection

**Path**: `/categories`

Manages income and expense categories for budget organization with color and icon preferences.

### Metadata Collection

**Path**: `/metadata`

Stores system configuration, user preferences, and application settings.

### Snapshots Collection

**Path**: `/snapshots`

Stores monthly financial snapshots for historical tracking and reporting.

## Data Relationships

### User-Centric Design

All collections are organized around the `userId` field, ensuring proper data isolation between users.

### References

- **Activity Log** → **Accounts**: `accountId` references account documents
- **Activity Log** → **Categories**: `categoryId` references category documents
- **All Collections** → **Users**: `userId` references the authenticated user

## Security Rules

Users can only access their own data through Firebase Authentication and Firestore security rules.
