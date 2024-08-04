import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import {
  ActivityLogFacadeService,
  EntityManagementActionType,
  CategoryManagementRecord,
} from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-management-record',
  templateUrl: './category-management-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagementRecordComponent implements OnInit {
  readonly actionType = EntityManagementActionType;

  @Input()
  record: CategoryManagementRecord;

  isRecordRemoving$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.categoryManagementRecord.${key}`;
  }

  removeRecord(): void {
    this.activityLogFacade.removeActivityLogRecord(this.record.id);
  }
}
