import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, MoveMoneyBetweenAccountsRecord } from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-move-money-between-accounts-record',
  templateUrl: './move-money-between-accounts-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoveMoneyBetweenAccountsRecordComponent implements OnInit {
  @Input()
  record: MoveMoneyBetweenAccountsRecord;

  isRecordRemoving$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }

  removeHandler(): void {
    this.activityLogFacade.removeActivityLogRecord(this.record.id);
  }
}
