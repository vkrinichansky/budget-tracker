import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoriesResetRecord } from '@budget-tracker/shared';

@Component({
  selector: 'app-categories-reset-record',
  templateUrl: './categories-reset-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesResetRecordComponent {
  private readonly rootTranslationKey = 'dashboard.activityLog.categoriesResetRecord';

  @Input()
  record: CategoriesResetRecord;

  get budgetType(): string {
    return this.record.budgetType[0].toUpperCase() + this.record.budgetType.slice(1);
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
