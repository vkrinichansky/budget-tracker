import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  Account,
  AccountsFacadeService,
  CurrencyExchangeService,
  CurrencyService,
} from '@budget-tracker/data';
import { AccountsValueEditModalService } from '../../services';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { Observable } from 'rxjs';

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
    return this.account.currency.id !== this.currencyService.getCurrentCurrency();
  }

  get accountValueInBaseCurrency(): string {
    return `${Math.round(
      this.account.value /
        this.currencyExchangeService.getCurrentExchangeRate()[this.account.currency.id]
    ).toString()} ${this.currencyService.getCurrencySymbol()}`;
  }

  constructor(
    private accountValueEditModalService: AccountsValueEditModalService,
    private currencyService: CurrencyService,
    private currencyExchangeService: CurrencyExchangeService,
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
