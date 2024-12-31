import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { AccountValueEditRecord } from '@budget-tracker/data';

@Component({
  selector: 'app-account-value-edit-record',
  templateUrl: './account-value-edit-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountValueEditRecordComponent {
  @Input()
  record: AccountValueEditRecord;
}
