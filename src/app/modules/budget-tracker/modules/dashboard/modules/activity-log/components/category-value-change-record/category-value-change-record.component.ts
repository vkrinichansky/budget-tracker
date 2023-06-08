import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BudgetType, CategoryValueChangeRecord } from '@budget-tracker/shared';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryValueChangeRecordComponent {
  readonly budgetType = BudgetType;

  @Input()
  record: CategoryValueChangeRecord;
}
