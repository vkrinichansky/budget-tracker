import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BudgetType, CategoryValueChangeRecord, CurrencyService } from '@budget-tracker/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-category-value-change-record',
  templateUrl: './category-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryValueChangeRecordComponent implements OnInit {
  readonly budgetType = BudgetType;

  @Input()
  record: CategoryValueChangeRecord;

  currencySymbol$: Observable<string>;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencySymbol$ = this.currencyService.getCurrencySymbol();
  }
}
