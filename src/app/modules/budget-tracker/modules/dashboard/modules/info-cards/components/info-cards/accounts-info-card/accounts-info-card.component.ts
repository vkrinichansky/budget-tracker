import { ChangeDetectionStrategy, Component, HostListener, OnInit } from '@angular/core';
import { AccountsListModalService } from '../../../services';
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
    private accountsFacade: AccountsFacadeService
  ) {}

  ngOnInit(): void {
    this.accountsAmount$ = this.accountsFacade.getAccountsAmount();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.accounts.${key}`;
  }

  @HostListener('click')
  private async openAccountsListModal(): Promise<void> {
    const isDisabled = await firstValueFrom(this.accountsAmount$.pipe(map((amount) => !amount)));

    if (!isDisabled) {
      this.accountsListModalService.openAccountsListModal();
    }
  }
}
