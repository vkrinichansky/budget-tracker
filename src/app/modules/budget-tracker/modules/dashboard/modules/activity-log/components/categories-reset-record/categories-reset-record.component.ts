import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoriesResetRecord } from '@budget-tracker/data';

@Component({
  selector: 'app-categories-reset-record',
  templateUrl: './categories-reset-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesResetRecordComponent {
  private readonly rootTranslationKey = 'dashboard.activityLog.categoriesResetRecord';

  @Input()
  record: CategoriesResetRecord;

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
