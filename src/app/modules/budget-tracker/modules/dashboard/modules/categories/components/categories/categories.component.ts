import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BudgetType, Category } from '@budget-tracker/data';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoryModalsService } from '../../services';
import { ChartJSTooltipConfig, doughnutChartPalette } from '@budget-tracker/design-system';
import { CategoriesFacadeService } from '@budget-tracker/data';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.categories';

  readonly isBackDisplayed$ = new BehaviorSubject<boolean>(false);
  readonly isFrontDisplayed$ = new BehaviorSubject<boolean>(true);

  readonly chartOptions: ChartOptions = this.getChartOptions();

  @Input()
  budgetType: BudgetType;

  title: string;

  categories$: Observable<Category[]>;

  isEmpty$: Observable<boolean>;

  shouldDisableFlipButton$: Observable<boolean>;

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

    this.shouldDisableFlipButton$ = combineLatest([this.isEmpty$, this.areAllCategoriesReset$]).pipe(
      map(([isEmpty, areReset]) => isEmpty || areReset)
    );

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

  toggleSide(): void {
    if (this.isFrontDisplayed$.value) {
      this.isFrontDisplayed$.next(false);
      this.isBackDisplayed$.next(true);
    } else {
      this.isFrontDisplayed$.next(true);
      this.isBackDisplayed$.next(false);
    }
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
