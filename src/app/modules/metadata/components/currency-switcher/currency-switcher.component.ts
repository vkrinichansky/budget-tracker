import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import {
  ConfirmationModalService,
  MenuAction,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { predefinedCurrenciesDictionary, CurrenciesEnum } from '@budget-tracker/models';
import { map, Observable } from 'rxjs';
import { CurrencyFacadeService, MetadataFacadeService } from '../../services';
import { ActionListenerService } from '@budget-tracker/utils';
import { MetadataActions } from '../../store';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CurrencySwitcherComponent implements OnInit {
  currentCurrency$: Observable<CurrenciesEnum>;
  currentCurrencyText$: Observable<string>;
  icon$: Observable<string>;
  menuActions: MenuAction[];

  constructor(
    private readonly currencyFacade: CurrencyFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.currentCurrency$ = this.currencyFacade.getCurrentCurrencyObs();
    this.currentCurrencyText$ = this.currentCurrency$.pipe(
      map(
        (currency) =>
          `${predefinedCurrenciesDictionary[currency].code} (${predefinedCurrenciesDictionary[currency].symbol})`
      )
    );
    this.icon$ = this.currentCurrency$.pipe(
      map((currency) => predefinedCurrenciesDictionary[currency].icon)
    );

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
              this.metadataFacade.changeCurrency(key as CurrenciesEnum);

              await this.actionListener.waitForResult(
                MetadataActions.updateCategoriesAfterCurrencyChangeSuccess,
                MetadataActions.updateCategoriesAfterCurrencyChangeFail
              );

              location.reload();
            } catch {
              this.snackbarHandler.showGeneralErrorSnackbar();
            }
          }
        ),
      disabledObs: this.currentCurrency$.pipe(map((currency) => currency === key)),
    }));
  }
}
