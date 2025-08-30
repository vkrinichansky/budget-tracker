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
import { getErrorMessage } from '@budget-tracker/utils';
import { AccountFacadeService } from '../../services';

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
      translationKey: 'account.accountCard.menu.remove',
      action: () => {
        this.confirmationModalService.openConfirmationModal(
          {
            questionTranslationKey: 'account.accountCard.removeConfirmationQuestion',
            questionTranslationParams: {
              accountName: this.account.name,
            },
          },
          async () => {
            try {
              await this.accountFacade.removeAccount(this.account.id);

              this.snackbarHandler.showMessageSnackbar('messages.account.accountRemoved');
            } catch (error) {
              this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
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
    private readonly accountFacade: AccountFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly currencyPipe: CurrencyPipe
  ) {}
}
