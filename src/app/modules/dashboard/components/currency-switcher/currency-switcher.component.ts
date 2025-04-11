import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CurrencyService, MetadataFacadeService } from '@budget-tracker/data';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { predefinedCurrenciesDictionary, CurrenciesEnum } from '@budget-tracker/models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySwitcherComponent implements OnInit {
  private readonly currentCurrency = this.currencyService.getCurrentCurrency();

  readonly currentLanguageText = `${predefinedCurrenciesDictionary[this.currentCurrency].code} (${
    predefinedCurrenciesDictionary[this.currentCurrency].symbol
  })`;
  readonly menuActions = this.getMenuActions();
  readonly icon = predefinedCurrenciesDictionary[this.currentCurrency].icon;

  isLoading$: Observable<boolean>;

  constructor(
    private currencyService: CurrencyService,
    private metadataFacade: MetadataFacadeService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.metadataFacade.getCurrencyChangingInProgress();
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(predefinedCurrenciesDictionary).map((key) => ({
      icon: predefinedCurrenciesDictionary[key].icon,
      translationKey: `currencies.${key}`,
      action: () =>
        this.confirmationModalService.openConfirmationModal(
          {
            questionTranslationKey: 'currencySwitcher.removeConfirmationQuestion',
            remarkTranslationKey: 'currencySwitcher.removeConfirmationRemark',
          },
          () => this.metadataFacade.changeCurrency(key as CurrenciesEnum)
        ),
      disabled: key === this.currentCurrency,
    }));
  }
}
