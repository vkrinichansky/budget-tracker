import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import {
  BudgetType,
  predefinedCurrenciesDictionary,
  StatisticsSnapshot,
} from '@budget-tracker/models';

interface FinancialMetric {
  icon: string;
  value: number;
  tooltip: string;
  displaySign: boolean;
  colorClass: string;
  translateParams: Record<string, string | number>;
}

@Component({
  selector: 'app-snapshot-item',
  templateUrl: './snapshot-item.component.html',
  styleUrl: './snapshot-item.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnapshotItemComponent implements OnInit {
  @HostBinding('class')
  private readonly classes = 'group';

  @Input({ required: true })
  snapshot: StatisticsSnapshot;

  metrics: FinancialMetric[];
  incomeCategories: number;
  expenseCategories: number;

  get currencyIcon(): string {
    return predefinedCurrenciesDictionary[this.snapshot.currency].icon;
  }

  get currencyText(): string {
    return `${predefinedCurrenciesDictionary[this.snapshot.currency].code} (${predefinedCurrenciesDictionary[this.snapshot.currency].symbol})`;
  }

  ngOnInit(): void {
    this.incomeCategories = this.snapshot.categories.filter(
      (category) => category.budgetType === BudgetType.Income
    ).length;
    this.expenseCategories = this.snapshot.categories.filter(
      (category) => category.budgetType === BudgetType.Expense
    ).length;

    this.metrics = this.getMetrics();
  }

  private getMetrics(): FinancialMetric[] {
    return [
      {
        icon: 'arrow-up',
        value: this.snapshot.income,
        tooltip: 'statistics.snapshots.income',
        displaySign: true,
        colorClass: this.snapshot.income === 0 ? 'text-charcoal' : 'text-dark-green',
        translateParams: {},
      },
      {
        icon: 'arrow-down',
        value: this.snapshot.expense === 0 ? 0 : -this.snapshot.expense,
        tooltip: 'statistics.snapshots.expense',
        displaySign: true,
        colorClass: this.snapshot.expense === 0 ? 'text-charcoal' : 'text-dark-red',
        translateParams: {},
      },
      {
        icon: 'calendar-dot-grid',
        value: this.snapshot.monthBalance,
        tooltip: 'statistics.snapshots.monthBalance',
        displaySign: true,
        colorClass:
          this.snapshot.monthBalance === 0
            ? 'text-charcoal'
            : this.snapshot.monthBalance > 0
              ? 'text-dark-green'
              : 'text-dark-red',
        translateParams: {},
      },
      {
        icon: 'equal-sign',
        value: this.snapshot.fullBalance,
        tooltip: 'statistics.snapshots.fullBalance',
        displaySign: false,
        colorClass: 'text-blue',
        translateParams: {},
      },
      {
        icon: 'checkbox-list',
        value: this.snapshot.categories.length,
        tooltip: 'statistics.snapshots.categories',
        displaySign: false,
        colorClass: 'text-charcoal',
        translateParams: {
          incomeCategories: this.incomeCategories,
          expenseCategories: this.expenseCategories,
        },
      },
    ];
  }
}
