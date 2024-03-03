import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BudgetType, Category } from '@budget-tracker/data';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoryModalsService } from '../../services';
import { ChartJSTooltipConfig, doughnutChartPalette } from '@budget-tracker/design-system';
import { CategoriesFacadeService } from '@budget-tracker/data';

type TabType = 'list' | 'chart';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.categories';

  readonly chartOptions: ChartOptions = this.getChartOptions();

  readonly currentTab$: BehaviorSubject<TabType> = new BehaviorSubject<TabType>('list');

  @Input()
  budgetType: BudgetType;

  title: string;

  categories$: Observable<Category[]>;

  isEmpty$: Observable<boolean>;

  areAllCategoriesReset$: Observable<boolean>;

  addButtonAction: () => void;

  chartData$: Observable<ChartData>;

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private categoryModalsService: CategoryModalsService
  ) {}

  ngOnInit(): void {
    switch (this.budgetType) {
      case BudgetType.Income:
        this.title = this.buildTranslationKey(`${BudgetType.Income}.title`);

        this.categories$ = this.categoriesFacade
          .getIncomeCategories()
          .pipe(map((categories) => categories.sort((a, b) => b.value - a.value)));

        this.addButtonAction = () => this.categoryModalsService.openAddIncomeCategoryModal();
        this.areAllCategoriesReset$ = this.categoriesFacade.areIncomeCategoriesAllReset();
        break;

      case BudgetType.Expense:
        this.title = this.buildTranslationKey(`${BudgetType.Expense}.title`);

        this.categories$ = this.categoriesFacade
          .getExpenseCategories()
          .pipe(map((categories) => categories.sort((a, b) => b.value - a.value)));

        this.addButtonAction = () => this.categoryModalsService.openAddExpenseCategoryModal();
        this.areAllCategoriesReset$ = this.categoriesFacade.areExpenseCategoriesAllReset();
        break;
    }

    this.isEmpty$ = this.categories$.pipe(map((categories) => !categories.length));

    this.chartData$ = this.categories$.pipe(
      map((categories) => [...categories].reverse()),
      map((categories) => ({
        labels: categories.map((category) => category.name),
        datasets: [
          {
            data: categories.map((category) => category.value),
            backgroundColor: doughnutChartPalette,
          },
        ],
      }))
    );
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  setTab(value: TabType): void {
    this.currentTab$.next(value);
  }

  private getChartOptions(): ChartOptions {
    return {
      layout: {
        autoPadding: false,
      },
      elements: { arc: { borderColor: '#395B72' } },
      plugins: {
        tooltip: {
          ...ChartJSTooltipConfig,
          callbacks: {
            label: (item) => `${item.label} - ${item.parsed}`,
            title: () => {
              return '';
            },
          },
        },
        legend: {
          display: false,
        },
      },
    };
  }
}
