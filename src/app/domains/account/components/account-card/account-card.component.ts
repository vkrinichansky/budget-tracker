import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  ConfirmationModalService,
  MenuAction,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { Account } from '../../models';
import {
  MetadataFacadeService,
  CurrencyPipe,
  predefinedCurrenciesDictionary,
} from '@budget-tracker/metadata';
import { ActionListenerService } from '@budget-tracker/utils';
import { AccountsFacadeService } from '../../services';
import { AccountsActions } from '../../store';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AccountCardComponent {
  readonly menuActions: MenuAction[] = [
    {
      icon: 'delete-bin',
      translationKey: 'dashboard.infoCards.accountCard.menu.remove',
      action: () => {
        this.confirmationModalService.openConfirmationModal(
          {
            questionTranslationKey: 'dashboard.infoCards.accountCard.removeConfirmationQuestion',
            questionTranslationParams: {
              accountName: this.account.name,
            },
          },
          async () => {
            try {
              this.accountsFacade.removeAccount(this.account.id);

              await this.actionListener.waitForResult(
                AccountsActions.accountRemoved,
                AccountsActions.removeAccountFail,
                (action) => action.accountId === this.account.id,
                (action) => action.accountId === this.account.id
              );

              this.snackbarHandler.showAccountRemovedSnackbar();
            } catch {
              this.snackbarHandler.showGeneralErrorSnackbar();
            }
          }
        );
      },
    },
  ];

  @Input()
  account: Account;

  @Input()
  shouldDisableDragButton: boolean;

  get isAccountWithForeignCurrency(): boolean {
    return this.account.currency !== this.metadataFacade.currentCurrency;
  }

  get accountValueInBaseCurrency(): string {
    return this.currencyPipe.transform(
      Math.round(
        this.metadataFacade.getConvertedValueForAccount(this.account.currency, this.account.value)
      )
    );
  }

  get currencySymbol(): string {
    return predefinedCurrenciesDictionary[this.account.currency].symbol;
  }

  constructor(
    private readonly metadataFacade: MetadataFacadeService,
    private readonly accountsFacade: AccountsFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly currencyPipe: CurrencyPipe
  ) {}
}
