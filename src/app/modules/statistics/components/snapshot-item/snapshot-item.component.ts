import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ClassToHexColorPipe, ProgressBarSection } from '@budget-tracker/design-system';
import {
  BudgetType,
  predefinedCurrenciesDictionary,
  StatisticsSnapshot,
} from '@budget-tracker/models';
import { TranslateService } from '@ngx-translate/core';
import { LanguageFacadeService } from '@budget-tracker/metadata';

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
  progressBarSections: ProgressBarSection[];

  get currencyIcon(): string {
    return predefinedCurrenciesDictionary[this.snapshot.currency].icon;
  }

  get currencyText(): string {
    return `${predefinedCurrenciesDictionary[this.snapshot.currency].code} (${predefinedCurrenciesDictionary[this.snapshot.currency].symbol})`;
  }

  get date(): string {
    return new Date(parseInt(this.snapshot.date)).toLocaleDateString(
      this.languageFacade.getCurrentLanguage(),
      {
        year: 'numeric',
        month: 'short',
      }
    );
  }

  constructor(
    private readonly classToHexPipe: ClassToHexColorPipe,
    private readonly translateService: TranslateService,
    private readonly languageFacade: LanguageFacadeService
  ) {}

  ngOnInit(): void {
    this.incomeCategories = this.snapshot.categories.filter(
      (category) => category.budgetType === BudgetType.Income
    ).length;
    this.expenseCategories = this.snapshot.categories.filter(
      (category) => category.budgetType === BudgetType.Expense
    ).length;

    this.metrics = this.getMetrics();
    this.progressBarSections = this.getProgressBarSections();
  }

  private getProgressBarSections(): ProgressBarSection[] {
    const total = this.snapshot.income + this.snapshot.expense;

    return [
      {
        percent: (this.snapshot.income * 100) / total,
        color: this.classToHexPipe.transform('bg-dark-green'),
        tooltip: this.translateService.instant('statistics.snapshots.incomePercent', {
          percent: Math.round((this.snapshot.income * 100) / total),
        }),
      },
      {
        percent: (this.snapshot.expense * 100) / total,
        color: this.classToHexPipe.transform('bg-dark-red'),
        tooltip: this.translateService.instant('statistics.snapshots.expensePercent', {
          percent: Math.round((this.snapshot.expense * 100) / total),
        }),
      },
    ];
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
