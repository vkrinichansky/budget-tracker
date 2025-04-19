import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoriesResetRecord } from '@budget-tracker/models';

@Component({
  selector: 'app-categories-reset-record',
  templateUrl: './categories-reset-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoriesResetRecordComponent {
  @Input()
  record: CategoriesResetRecord;

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.categoriesResetRecord.${key}`;
  }
}
