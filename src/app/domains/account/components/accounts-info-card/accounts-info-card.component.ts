import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { AccountsFacadeService, AccountModalService } from '../../services';

@Component({
  selector: 'app-accounts-info-card',
  templateUrl: './accounts-info-card.component.html',
  styleUrl: './accounts-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AccountsInfoCardComponent implements OnInit {
  accountsAmount$: Observable<number>;

  constructor(
    private readonly accountsFacade: AccountsFacadeService,
    private readonly accountsModalsService: AccountModalService
  ) {}

  ngOnInit(): void {
    this.accountsAmount$ = this.accountsFacade.getAccountsAmount();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.accounts.${key}`;
  }

  openAddAccountModal(): void {
    this.accountsModalsService.openAddAccountsModal();
  }

  openMoneyMovementModal(): void {
    this.accountsModalsService.openMoneyMovementModal();
  }

  @HostListener('click')
  private async openAccountsListModal(): Promise<void> {
    const isDisabled = await firstValueFrom(this.accountsAmount$.pipe(map((amount) => !amount)));

    if (!isDisabled) {
      this.accountsModalsService.openAccountsListModal();
    }
  }
}
