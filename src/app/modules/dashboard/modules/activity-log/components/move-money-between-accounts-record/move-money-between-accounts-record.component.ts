import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MoveMoneyBetweenAccountsRecord } from '@budget-tracker/models';
import { predefinedCurrenciesDictionary } from '@budget-tracker/metadata';

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
}
