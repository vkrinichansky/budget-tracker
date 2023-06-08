import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { BudgetType, Category } from '@budget-tracker/shared';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { CategoryModalsService } from '../../services';
import { ChartData, ChartOptions } from 'chart.js';

const categoriesChartPalette = [
  '#ffffd9',
  '#edf8b1',
  '#c7e9b4',
  '#7fcdbb',
  '#41b6c4',
  '#1d91c0',
  '#225ea8',
  '#253494',
  '#081d58',
];

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.categories';

  @Input()
  budgetType: BudgetType;

  readonly isBackDisplayed$ = new BehaviorSubject<boolean>(false);

  readonly isFrontDisplayed$ = new BehaviorSubject<boolean>(true);

  title: string;

  categories$: Observable<Category[]>;

  isEmpty$: Observable<boolean>;

  shouldDisableFlipButton$: Observable<boolean>;

  areAllCategoriesReset$: Observable<boolean>;

  addButtonAction: () => void;

  chartData$: Observable<ChartData>;

  chartOptions: ChartOptions;

  constructor(private btFacade: BudgetTrackerFacadeService, private categoryModalsService: CategoryModalsService) {}

  ngOnInit(): void {
    switch (this.budgetType) {
      case BudgetType.Income:
        this.title = this.buildTranslationKey(`${BudgetType.Income}.title`);
        this.categories$ = this.btFacade.getIncomeCategories();
        this.addButtonAction = () => this.categoryModalsService.openAddIncomeCategoryModal();
        this.areAllCategoriesReset$ = this.btFacade.areIncomeCategoriesAllReset();
        break;

      case BudgetType.Expense:
        this.title = this.buildTranslationKey(`${BudgetType.Expense}.title`);
        this.categories$ = this.btFacade.getExpenseCategories();
        this.addButtonAction = () => this.categoryModalsService.openAddExpenseCategoryModal();
        this.areAllCategoriesReset$ = this.btFacade.areExpenseCategoriesAllReset();
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
            backgroundColor: categoriesChartPalette,
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
