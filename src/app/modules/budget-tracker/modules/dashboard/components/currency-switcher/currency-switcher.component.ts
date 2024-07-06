import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuAction } from '@budget-tracker/design-system';
import { PredefinedCurrencies, CurrencySymbolMapping, CurrencyService, CurrenciesEnum } from '@budget-tracker/shared';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySwitcherComponent {
  readonly currentCurrency = this.currencyService.getCurrentCurrency();
  readonly currentLanguageText = `${PredefinedCurrencies[this.currentCurrency].short} (${
    CurrencySymbolMapping[this.currentCurrency]
  })`;
  readonly menuActions = this.getMenuActions();
  readonly icon = PredefinedCurrencies[this.currentCurrency].icon;

  constructor(private currencyService: CurrencyService) {}

  buildTranslationKey(key: string): string {
    return `currencySwitcher.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(PredefinedCurrencies).map((key) => ({
      icon: PredefinedCurrencies[key].icon,
      translationKey: this.buildTranslationKey(`currencies.${PredefinedCurrencies[key].translationKey}`),
      action: () => this.currencyService.setCurrencyToLS(key as CurrenciesEnum, true),
      disabled: key === this.currentCurrency,
    }));
  }
}
