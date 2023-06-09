import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BudgetType, Category } from '@budget-tracker/shared';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoriesFacadeService, CategoryModalsService } from '../../services';
import { doughnutChartPalette } from '@budget-tracker/design-system';

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

  @Input()
  budgetType: BudgetType;

  title: string;

  categories$: Observable<Category[]>;

  isEmpty$: Observable<boolean>;

  shouldDisableFlipButton$: Observable<boolean>;

  areAllCategoriesReset$: Observable<boolean>;

  addButtonAction: () => void;

  chartData$: Observable<ChartData>;
  chartOptions: ChartOptions;

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private categoryModalsService: CategoryModalsService
  ) {}

  ngOnInit(): void {
    switch (this.budgetType) {
      case BudgetType.Income:
        this.title = this.buildTranslationKey(`${BudgetType.Income}.title`);
        this.categories$ = this.categoriesFacade.getIncomeCategories();
        this.addButtonAction = () => this.categoryModalsService.openAddIncomeCategoryModal();
        this.areAllCategoriesReset$ = this.categoriesFacade.areIncomeCategoriesAllReset();
        break;

      case BudgetType.Expense:
        this.title = this.buildTranslationKey(`${BudgetType.Expense}.title`);
        this.categories$ = this.categoriesFacade.getExpenseCategories();
        this.addButtonAction = () => this.categoryModalsService.openAddExpenseCategoryModal();
        this.areAllCategoriesReset$ = this.categoriesFacade.areExpenseCategoriesAllReset();
        break;
    }

    this.isEmpty$ = this.categories$.pipe(map((categories) => !categories.length));

    this.shouldDisableFlipButton$ = combineLatest([this.isEmpty$, this.areAllCategoriesReset$]).pipe(
      map(([isEmpty, areReset]) => isEmpty || areReset)
    );

    this.chartData$ = this.categories$.pipe(
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

    this.chartOptions = this.getChartOptions();
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
      elements: { arc: { borderColor: '#395B72', hoverBorderColor: '#2C4251' } },
      plugins: {
        tooltip: {
          bodyFont: {
            family: 'Inter',
            size: 14,
            lineHeight: 1.5,
          },
          cornerRadius: 4,
          caretSize: 0,
          borderWidth: 0,
          backgroundColor: '#395B72',
          displayColors: false,
          callbacks: {
            label: (item) => `${item.label} - ${item.parsed}`,
            title: () => {
              return '';
            },
          },
          padding: {
            x: 8,
            y: 4,
          },
        },
        legend: {
          display: false,
        },
      },
    };
  }
}
