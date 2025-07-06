import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  ConfirmationModalService,
  MenuAction,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { MetadataFacadeService } from '../../services';
import { predefinedCurrenciesDictionary, CurrenciesEnum } from '../../models';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CurrencySwitcherComponent implements OnInit {
  currentCurrency: CurrenciesEnum;
  currentCurrencyText: string;
  icon: string;
  menuActions: MenuAction[];

  constructor(
    private readonly metadataFacade: MetadataFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.currentCurrency = this.metadataFacade.currentCurrency;
    this.currentCurrencyText = `${predefinedCurrenciesDictionary[this.currentCurrency].code} (${predefinedCurrenciesDictionary[this.currentCurrency].symbol})`;
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
          async () => {
            try {
              await this.metadataFacade.changeCurrency(key as CurrenciesEnum);

              location.reload();
            } catch {
              this.snackbarHandler.showGeneralErrorSnackbar();
            }
          }
        ),
      disabled: this.currentCurrency === key,
    }));
  }
}
