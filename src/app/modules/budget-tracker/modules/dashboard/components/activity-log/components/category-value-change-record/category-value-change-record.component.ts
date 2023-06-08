import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { BudgetType, CategoryValueChangeRecord } from '@budget-tracker/shared';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryValueChangeRecordComponent {
  @HostBinding('class')
  private readonly classes = 'flex justify-between items-center';

  readonly budgetType = BudgetType;

  @Input()
  record: CategoryValueChangeRecord;

  get time(): string {
    return new Date(this.record.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
