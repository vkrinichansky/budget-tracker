import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AccountsFacadeService } from '../../../../services';
import {
  ConfirmationModalService,
  MenuAction,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { BehaviorSubject } from 'rxjs';
import { Account } from '@budget-tracker/models';
import { CurrencyFacadeService } from '@budget-tracker/metadata';
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
  readonly isAccountRemoving$ = new BehaviorSubject<boolean>(false);

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
            this.isAccountRemoving$.next(true);

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
            } finally {
              this.isAccountRemoving$.next(false);
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
    return this.account.currency.id !== this.currencyFacade.getCurrentCurrency();
  }

  get accountValueInBaseCurrency(): string {
    return `${Math.round(
      this.currencyFacade.getConvertedValueForAccount(this.account)
    ).toString()} ${this.currencyFacade.getCurrencySymbol()}`;
  }

  constructor(
    private readonly accountsModalsService: AccountsModalsService,
    private readonly currencyFacade: CurrencyFacadeService,
    private readonly accountsFacade: AccountsFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}
}
