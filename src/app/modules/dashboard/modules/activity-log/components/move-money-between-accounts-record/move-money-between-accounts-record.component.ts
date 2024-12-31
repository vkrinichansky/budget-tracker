import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MoveMoneyBetweenAccountsRecord } from '@budget-tracker/data';

@Component({
  selector: 'app-move-money-between-accounts-record',
  templateUrl: './move-money-between-accounts-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveMoneyBetweenAccountsRecordComponent {
  @Input()
  record: MoveMoneyBetweenAccountsRecord;
}
