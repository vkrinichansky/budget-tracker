import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  CurrenciesEnum,
  CurrencyService,
  MetadataFacadeService,
  predefinedCurrenciesDictionary,
} from '@budget-tracker/data';
import { MenuAction } from '@budget-tracker/design-system';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySwitcherComponent implements OnInit {
  readonly currentCurrency = this.currencyService.getCurrentCurrency();
  readonly currentLanguageText = `${predefinedCurrenciesDictionary[this.currentCurrency].code} (${
    predefinedCurrenciesDictionary[this.currentCurrency].symbol
  })`;
  readonly menuActions = this.getMenuActions();
  readonly icon = predefinedCurrenciesDictionary[this.currentCurrency].icon;

  isLoading$: Observable<boolean>;

  constructor(
    private currencyService: CurrencyService,
    private metadataFacade: MetadataFacadeService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.metadataFacade.getCurrencyChangingInProgress();
  }

  buildTranslationKey(key: string): string {
    return `currencySwitcher.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(predefinedCurrenciesDictionary).map((key) => ({
      icon: predefinedCurrenciesDictionary[key].icon,
      translationKey: `currencies.${key}`,
      action: () => this.metadataFacade.changeCurrency(key as CurrenciesEnum),
      disabled: key === this.currentCurrency,
    }));
  }
}
