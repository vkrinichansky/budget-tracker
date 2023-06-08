import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CategoryManagementActionType, CategoryManagementRecord } from '@budget-tracker/shared';

@Component({
  selector: 'app-category-management-record',
  templateUrl: './category-management-record.component.html',
  styleUrls: ['./category-management-record.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryManagementRecordComponent {
  private readonly rootTranslationKey = 'dashboard.activityLog.categoryManagementRecord';

  readonly actionType = CategoryManagementActionType;

  @Input()
  record: CategoryManagementRecord;

  get time(): string {
    return new Date(this.record.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
