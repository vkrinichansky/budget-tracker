import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RootValueActionType, RootValueChangeRecord } from '@budget-tracker/shared';

@Component({
  selector: 'app-root-value-change-record',
  templateUrl: './root-value-change-record.component.html',
  styleUrls: ['./root-value-change-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootValueChangeRecordComponent {
  private readonly rootTranslationKey = 'dashboard.activityLog.rootValueChangeRecord';

  readonly actionType = RootValueActionType;

  @Input()
  record: RootValueChangeRecord;

  get time(): string {
    return new Date(this.record.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}