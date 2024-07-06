import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuAction } from '@budget-tracker/design-system';
import { CurrenciesEnum, CurrencyService, predefinedCurrenciesDictionary } from '@budget-tracker/utils';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySwitcherComponent {
  readonly currentCurrency = this.currencyService.getCurrentCurrency();
  readonly currentLanguageText = `${predefinedCurrenciesDictionary[this.currentCurrency].code} (${
    predefinedCurrenciesDictionary[this.currentCurrency].symbol
  })`;
  readonly menuActions = this.getMenuActions();
  readonly icon = predefinedCurrenciesDictionary[this.currentCurrency].icon;

  constructor(private currencyService: CurrencyService) {}

  buildTranslationKey(key: string): string {
    return `currencySwitcher.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(predefinedCurrenciesDictionary).map((key) => ({
      icon: predefinedCurrenciesDictionary[key].icon,
      translationKey: `currencies.${key}`,
      action: () => this.currencyService.setCurrencyToLS(key as CurrenciesEnum, true),
      disabled: key === this.currentCurrency,
    }));
  }
}
