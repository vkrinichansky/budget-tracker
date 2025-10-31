# Metadata Domain

This document describes the Metadata domain, which manages system configuration, user preferences, and application-wide settings in the SmartExpense application.

## Overview

The Metadata domain is responsible for managing user preferences including currency selection, language settings, monthly reset date configuration, and currency exchange rates. It provides system-wide configuration that affects how the application displays and processes data.

## Domain Structure

```
metadata/
├── components/          # UI components for metadata settings
├── pipes/              # Currency formatting pipe
├── services/           # Business logic and data access
│   ├── metadata-service/     # Core business logic
│   ├── metadata-api-service/ # Firestore data access
│   └── metadata-facade/      # Public API facade
├── models/             # Metadata entities and events
└── metadata.module.ts  # Domain module definition
```

## Models

### UserMetadata Interface

```typescript
interface UserMetadata {
  currency: CurrenciesEnum;  // User's preferred currency
  language: LanguagesEnum;   // User's preferred language
  resetDate: string;         // Monthly reset date (day of month)
}
```

### Currency Models

```typescript
enum CurrenciesEnum {
  UAH = 'uah',
  USD = 'usd',
  EUR = 'eur'
}

interface Currency {
  id: CurrenciesEnum;
  code: string;        // Currency code (e.g., 'USD')
  icon: string;        // Flag icon identifier
  symbol: string;      // Currency symbol (e.g., '$')
}

// Predefined currencies dictionary
const predefinedCurrenciesDictionary: Record<CurrenciesEnum, Currency>
```

### Language Models

```typescript
enum LanguagesEnum {
  English = 'en-US',
  Ukrainian = 'uk-UA'
}

interface Language {
  id: LanguagesEnum;
  code: string;        // Language code (e.g., 'EN')
  icon: string;        // Flag icon identifier
}

// Predefined languages dictionary
const predefinedLanguagesDictionary: Record<LanguagesEnum, Language>
```

### Currency Exchange Rate

```typescript
interface CurrencyExchangeRate {
  [currency: string]: number;  // Exchange rate to base currency
}
```

## Services

### MetadataService

**Purpose**: Core business logic and state management

**Key Properties**:
- `currentCurrency`: Get current user currency
- `currencyExchangeRate`: Get currency exchange rates
- `currentLanguage`: Get current user language
- `resetDate`: Get monthly reset date

**Key Methods**:
- `setMetadata(currency, exchangeRate, language, resetDate)`: Set all metadata
- `changeCurrency(newCurrency)`: Change user currency
- `changeLanguage(newLanguage)`: Change user language
- `initMetadata()`: Initialize metadata from store/database
- `loadExchangeRate(currency)`: Load exchange rates for currency

### MetadataApiService

**Purpose**: Firestore database operations and external API calls

**Key Methods**:
- `loadMetadata()`: Load user metadata from Firestore
- `changeLanguage(newLanguage)`: Update language in Firestore
- `getCurrencyExchangeRate(currency)`: Fetch exchange rates from external API

### MetadataFacadeService

**Purpose**: Public API for components

**Responsibilities**:
- Provides unified interface to components
- Delegates to MetadataService and MetadataApiService
- Exposes configuration properties

## Components

### CurrencySwitcherComponent

**Purpose**: Currency selection and switching UI

**Features**:
- Display current currency
- Currency selection dropdown
- Currency change handling
- Visual currency indicators

### LanguageSwitcherComponent

**Purpose**: Language selection and switching UI

**Features**:
- Display current language
- Language selection dropdown
- Language change handling
- Visual language indicators

## Pipes

### CurrencyPipe

**Purpose**: Format currency values for display

**Features**:
- Currency symbol formatting
- Number formatting
- Locale-aware formatting
- Multi-currency support

**Usage**:
```html
{{ amount | currency }}
```

## Store (NgRx)

### Actions

- `loadMetadata`: Trigger metadata loading
- `metadataLoaded`: Metadata loaded from database
- `changeLanguage`: Trigger language change
- `changeCurrency`: Trigger currency change

### Effects

**loadMetadata$**: Loads metadata from Firestore and fetches exchange rates

**changeLanguage$**: Updates language in Firestore, updates translation service, and emits success/error events

**changeCurrency$**: Updates currency in Firestore, loads exchange rates, and emits success/error events

## Events

### MetadataEvents Enum

```typescript
enum MetadataEvents {
  CHANGE_LANGUAGE = 'Change language',
  CURRENCY_CHANGE_START = 'Currency change start',
  CURRENCY_CHANGE_FINISH = 'Currency change finish'
}
```

### Event Interfaces

```typescript
interface CurrencyChangeEvent {
  newCurrency: CurrenciesEnum;
}
```

## Key Features

### Currency Management

- **Supported Currencies**: UAH, USD, EUR
- **Exchange Rates**: Fetched from external API
- **Currency Conversion**: Automatic conversion calculations
- **Currency Display**: Symbol and code formatting

### Language Support

- **Supported Languages**: English (en-US), Ukrainian (uk-UA)
- **Translation Integration**: Angular i18n integration
- **Language Switching**: Runtime language changes
- **Locale Formatting**: Locale-aware number and date formatting

### User Preferences

- **Currency Preference**: User-selected default currency
- **Language Preference**: User-selected default language
- **Reset Date**: Configurable monthly reset day
- **Persistent Settings**: Saved to Firestore

### Exchange Rates

- **External API Integration**: Real-time exchange rate fetching
- **Rate Caching**: Exchange rates cached for performance
- **Multi-Currency Support**: Support for multiple base currencies
- **Rate Updates**: Automatic rate updates when currency changes

## Workflows

### Load Metadata Flow

1. Application initialization
2. MetadataService.initMetadata() called
3. Load user metadata from Firestore
4. Fetch exchange rates for current currency
5. Set metadata in service
6. Update translation service with language
7. Metadata ready for use

### Change Currency Flow

1. User selects new currency
2. Currency change event emitted
3. Orchestrator coordinates currency change
4. Exchange rates fetched for new currency
5. Account balances converted
6. Metadata updated in Firestore
7. Success event emitted
8. UI updates with new currency

### Change Language Flow

1. User selects new language
2. Language change action dispatched
3. Metadata updated in Firestore
4. Translation service updated
5. Application language changes
6. Success event emitted
7. UI updates with new language

## Dependencies

### External Dependencies

- **External API**: Currency exchange rate API
- **Angular i18n**: Translation service
- **Account Domain**: Currency conversion for accounts
- **Category Domain**: Currency conversion for categories

### Internal Dependencies

- NgRx Effects for async operations
- Firebase Firestore for data persistence
- Angular Translate for language management

## Usage Examples

### Getting Current Currency

```typescript
const currency = this.metadataService.currentCurrency;
```

### Getting Exchange Rates

```typescript
const exchangeRate = this.metadataService.currencyExchangeRate;
const usdRate = exchangeRate[CurrenciesEnum.USD];
```

### Changing Currency

```typescript
await this.metadataFacade.changeCurrency(CurrenciesEnum.EUR);
```

### Changing Language

```typescript
await this.metadataFacade.changeLanguage(LanguagesEnum.Ukrainian);
```

### Using Currency Pipe

```html
<div>{{ accountBalance | currency }}</div>
```

### Getting Reset Date

```typescript
const resetDate = this.metadataService.resetDate;
```

## Best Practices

### Currency Management

- Always use currentCurrency property for display
- Use currencyExchangeRate for conversions
- Handle missing exchange rates gracefully
- Cache exchange rates appropriately

### Language Management

- Use currentLanguage property for locale-specific operations
- Update translation service when language changes
- Handle translation keys that don't exist
- Test all supported languages

### Configuration

- Initialize metadata on application startup
- Handle metadata loading errors
- Provide default values when metadata unavailable
- Persist user preferences properly

### Performance

- Cache exchange rates to reduce API calls
- Load metadata once and reuse
- Use observables for reactive updates
- Minimize unnecessary currency conversions
