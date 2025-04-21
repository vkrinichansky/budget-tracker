import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { predefinedCurrenciesDictionary, CurrenciesEnum } from '@budget-tracker/models';
import { Observable } from 'rxjs';
import { CurrencyFacadeService, MetadataFacadeService } from '../../services';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CurrencySwitcherComponent implements OnInit {
  currentCurrency: CurrenciesEnum;
  currentLanguageText: string;
  icon: string;
  menuActions: MenuAction[];
  isLoading$: Observable<boolean>;

  constructor(
    private readonly currencyFacade: CurrencyFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.currentCurrency = this.currencyFacade.getCurrentCurrency();
    this.currentLanguageText = `${predefinedCurrenciesDictionary[this.currentCurrency].code} (${predefinedCurrenciesDictionary[this.currentCurrency].symbol})`;
    this.icon = predefinedCurrenciesDictionary[this.currentCurrency].icon;

    this.menuActions = this.getMenuActions();
  }

  private getMenuActions(): MenuAction[] {
    return (Object.keys(predefinedCurrenciesDictionary) as CurrenciesEnum[]).map((key) => ({
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
