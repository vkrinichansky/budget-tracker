import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  ActivityLogFacadeService,
  EntityManagementActionType,
  AccountManagementRecord,
} from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-account-management-record',
  templateUrl: './account-management-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountManagementRecordComponent implements OnInit {
  readonly actionType = EntityManagementActionType;

  @Input()
  record: AccountManagementRecord;

  isRecordRemoving$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.accountManagementRecord.${key}`;
  }

  removeRecord(): void {
    this.activityLogFacade.removeActivityLogRecord(this.record.id);
  }
}
