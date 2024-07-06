import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { AccountValueEditRecord, ActivityLogFacadeService } from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-value-edit-record',
  templateUrl: './account-value-edit-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountValueEditRecordComponent implements OnInit {
  @Input()
  record: AccountValueEditRecord;

  isRecordRemoving$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }
  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.rootValueChangeRecord.${key}`;
  }
  removeHandler(): void {
    this.activityLogFacade.removeActivityLogRecord(this.record.id);
  }
}
