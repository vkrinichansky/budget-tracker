import { Component, HostBinding, Input } from '@angular/core';
import { BudgetType, CategoryValueChangeRecord } from '@budget-tracker/shared';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  styleUrls: ['./category-value-change-record.component.scss'],
})
export class CategoryValueChangeRecordComponent {
  private readonly rootTranslationKey = 'dashboard.activityLog.rootValueChangeRecord';

  @HostBinding('class')
  private readonly classes = 'flex justify-between items-center';

  readonly budgetType = BudgetType;

  @Input()
  record: CategoryValueChangeRecord;

  get time(): string {
    return new Date(this.record.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
