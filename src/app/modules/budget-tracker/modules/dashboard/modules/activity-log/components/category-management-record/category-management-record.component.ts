import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoryManagementActionType, CategoryManagementRecord } from '@budget-tracker/data';

@Component({
  selector: 'app-category-management-record',
  templateUrl: './category-management-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagementRecordComponent {
  private readonly rootTranslationKey = 'dashboard.activityLog.categoryManagementRecord';

  readonly actionType = CategoryManagementActionType;

  @Input()
  record: CategoryManagementRecord;

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
