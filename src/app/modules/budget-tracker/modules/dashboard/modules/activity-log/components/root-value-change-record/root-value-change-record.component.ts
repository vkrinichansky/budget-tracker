import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RootValueActionType, RootValueChangeRecord } from '@budget-tracker/shared';

@Component({
  selector: 'app-root-value-change-record',
  templateUrl: './root-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootValueChangeRecordComponent {
  private readonly rootTranslationKey = 'dashboard.activityLog.rootValueChangeRecord';

  readonly actionType = RootValueActionType;

  @Input()
  record: RootValueChangeRecord;

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
