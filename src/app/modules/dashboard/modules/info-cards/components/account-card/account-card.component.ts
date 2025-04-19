import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AccountsFacadeService } from '../../../../services';
import { AccountsValueEditModalService } from '../../services';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { Observable } from 'rxjs';
import { Account } from '@budget-tracker/models';
import { CurrencyFacadeService } from '@budget-tracker/metadata';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent implements OnInit {
  readonly menuActions: MenuAction[] = [
    {
      icon: 'edit',
      translationKey: this.buildTranslationKey('menu.editValue'),
      action: () => this.accountValueEditModalService.openEditAccountValueModal(this.account.id),
    },

    {
      icon: 'delete-bin',
      translationKey: this.buildTranslationKey('menu.remove'),
      action: () => {
        this.confirmationModalService.openConfirmationModal(
          {
            questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
            questionTranslationParams: {
              accountName: this.account.name,
            },
          },
          () => this.accountsFacade.removeAccount(this.account.id)
        );
      },
    },
  ];

  @Input()
  account: Account;

  @Input()
  shouldDisableDragButton: boolean;

  isAccountRemoving$: Observable<boolean>;

  get primaryText(): string {
    return `${this.account.value} ${this.account.currency.symbol}`;
  }

  get isAccountWithForeignCurrency(): boolean {
    return this.account.currency.id !== this.currencyFacade.getCurrentCurrency();
  }

  get accountValueInBaseCurrency(): string {
    return `${Math.round(
      this.currencyFacade.getConvertedValueForAccount(this.account)
    ).toString()} ${this.currencyFacade.getCurrencySymbol()}`;
  }

  constructor(
    private accountValueEditModalService: AccountsValueEditModalService,
    private currencyFacade: CurrencyFacadeService,
    private accountsFacade: AccountsFacadeService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.isAccountRemoving$ = this.accountsFacade.isAccountRemoving(this.account.id);
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.accountCard.${key}`;
  }
}
