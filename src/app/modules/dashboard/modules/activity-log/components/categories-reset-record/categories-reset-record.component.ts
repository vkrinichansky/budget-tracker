import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, CategoriesResetRecord } from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-categories-reset-record',
  templateUrl: './categories-reset-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesResetRecordComponent implements OnInit {
  @Input()
  record: CategoriesResetRecord;

  isRecordRemoving$: Observable<boolean>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.categoriesResetRecord.${key}`;
  }

  removeRecord(): void {
    this.activityLogFacade.removeActivityLogRecord(this.record.id);
  }
}
