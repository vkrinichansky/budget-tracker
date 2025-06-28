import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AccountsFacadeService } from '../../../../services';
import {
  ConfirmationModalService,
  MenuAction,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { Account } from '@budget-tracker/models';
import { MetadataService, CurrencyPipe } from '@budget-tracker/metadata';
import { ActionListenerService } from '@budget-tracker/utils';
import { AccountsActions } from '../../../../store';
import { AccountsModalsService } from '../../services';

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
      icon: 'edit',
      translationKey: 'dashboard.infoCards.accountCard.menu.editValue',
      action: () => this.accountsModalsService.openEditAccountValueModal(this.account.id),
    },

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
    return this.account.currency.id !== this.metadataService.getCurrentCurrency();
  }

  get accountValueInBaseCurrency(): string {
    return this.currencyPipe.transform(
      Math.round(
        this.metadataService.getConvertedValueForAccount(
          this.account.currency.id,
          this.account.value
        )
      )
    );
  }

  constructor(
    private readonly accountsModalsService: AccountsModalsService,
    private readonly metadataService: MetadataService,
    private readonly accountsFacade: AccountsFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly currencyPipe: CurrencyPipe
  ) {}
}
