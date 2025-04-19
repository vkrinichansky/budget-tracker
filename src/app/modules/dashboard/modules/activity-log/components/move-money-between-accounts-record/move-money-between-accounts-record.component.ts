import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MoveMoneyBetweenAccountsRecord } from '@budget-tracker/models';

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
      this.record.fromAccount.currency.symbol === this.record.toAccount.currency.symbol
    );
  }
}
