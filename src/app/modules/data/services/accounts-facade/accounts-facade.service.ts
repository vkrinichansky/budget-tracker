import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Account } from '../../models';
import { Store } from '@ngrx/store';
import { AccountsSelectors } from '../../store';

@Injectable()
export class AccountsFacadeService {
  constructor(private store: Store) {}

  getAllAccounts(): Observable<Account[]> {
    return this.store.select(AccountsSelectors.allAccountsSelector);
  }

  getFullBallance(): Observable<number> {
    return this.getAllAccounts().pipe(
      map((accounts) =>
        accounts
          .filter((account) => !account.isForeignCurrency)
          .reduce((fullBalance, account) => fullBalance + account.value, 0)
      )
    );
  }
}
