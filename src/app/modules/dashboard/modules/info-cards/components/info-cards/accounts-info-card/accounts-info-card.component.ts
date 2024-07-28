import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import {
  AccountsListModalService,
  AccountsModalsService,
  AddAccountModalService,
} from '../../../services';
import { AccountsFacadeService } from '@budget-tracker/data';
import { firstValueFrom, map, Observable } from 'rxjs';

@Component({
  selector: 'app-accounts-info-card',
  templateUrl: './accounts-info-card.component.html',
  styleUrl: './accounts-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsInfoCardComponent implements OnInit {
  accountsAmount$: Observable<number>;

  constructor(
    private accountsListModalService: AccountsListModalService,
    private accountsFacade: AccountsFacadeService,
    private addAccountModalService: AddAccountModalService,
    private accountsModalsService: AccountsModalsService
  ) {}

  ngOnInit(): void {
    this.accountsAmount$ = this.accountsFacade.getAccountsAmount();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.accounts.${key}`;
  }

  openAddAccountModal(): void {
    this.addAccountModalService.openAccountsListModal();
  }

  openMoneyMovementModal(): void {
    this.accountsModalsService.openMoneyMovementModal();
  }

  @HostListener('click')
  private async openAccountsListModal(): Promise<void> {
    const isDisabled = await firstValueFrom(this.accountsAmount$.pipe(map((amount) => !amount)));

    if (!isDisabled) {
      this.accountsListModalService.openAccountsListModal();
    }
  }
}
