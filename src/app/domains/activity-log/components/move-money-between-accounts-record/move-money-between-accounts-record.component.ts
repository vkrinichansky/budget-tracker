import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrenciesEnum, predefinedCurrenciesDictionary } from '@budget-tracker/metadata';
import { MoveMoneyBetweenAccountsRecord } from '../../models';

@Component({
  selector: 'app-move-money-between-accounts-record',
  templateUrl: './move-money-between-accounts-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MoveMoneyBetweenAccountsRecordComponent {
  @Input()
  record: MoveMoneyBetweenAccountsRecord;

  get isSameValueAndCurrency(): boolean {
    return (
      this.record.fromAccountValue === this.record.toAccountValue &&
      predefinedCurrenciesDictionary[this.record.fromAccount.currency].symbol ===
        predefinedCurrenciesDictionary[this.record.toAccount.currency].symbol
    );
  }

  getCurrencySymbol(currency: CurrenciesEnum): string {
    return predefinedCurrenciesDictionary[currency].symbol;
  }
}
