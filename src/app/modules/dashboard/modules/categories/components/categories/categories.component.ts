import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoryModalsService } from '../../services';
import {
  ChartJSTooltipConfig,
  ConfirmationModalService,
  MainPalette,
  MenuAction,
} from '@budget-tracker/design-system';
import { CategoriesFacadeService } from '../../../../services';
import { isMobileWidth, NumberSpacePipe } from '@budget-tracker/utils';
import { BudgetType, Category } from '@budget-tracker/models';
import { CurrencyPipe } from '@budget-tracker/metadata';

type TabType = 'list' | 'chart';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoriesComponent implements OnInit {
  readonly currentTab$: BehaviorSubject<TabType> = new BehaviorSubject<TabType>('list');

  @Input()
  budgetType: BudgetType;

  title: string;
  chartOptions: ChartOptions;
  menuActions: MenuAction[];

  categories$: Observable<Category[]>;
  isEmpty$: Observable<boolean>;
  areAllCategoriesReset$: Observable<boolean>;
  chartData$: Observable<ChartData>;

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private categoryModalsService: CategoryModalsService,
    private currencyPipe: CurrencyPipe,
    private numberSpacePipe: NumberSpacePipe,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.title = this.buildTranslationKey(`${this.budgetType}.title`);
    this.chartOptions = this.getChartOptions();

    this.initDataAccordingBudgetType();
    this.initIsEmptyListener();
    this.initChartData();
    this.initMenuActions();
  }

  trackBy(_: number, category: Category): string {
    return category.id;
  }

  buildTranslationKey(key: string): string {
    return `dashboard.categories.${key}`;
  }

  setTab(value: TabType): void {
    this.currentTab$.next(value);
  }

  private initDataAccordingBudgetType(): void {
    switch (this.budgetType) {
      case BudgetType.Income:
        this.categories$ = this.categoriesFacade
          .getIncomeCategories()
          .pipe(map((categories) => categories.sort((a, b) => b.value - a.value)));

        this.areAllCategoriesReset$ = this.categoriesFacade.areIncomeCategoriesAllReset();
        break;

      case BudgetType.Expense:
        this.categories$ = this.categoriesFacade
          .getExpenseCategories()
          .pipe(map((categories) => categories.sort((a, b) => b.value - a.value)));

        this.areAllCategoriesReset$ = this.categoriesFacade.areExpenseCategoriesAllReset();
        break;
    }
  }

  private initIsEmptyListener(): void {
    this.isEmpty$ = this.categories$.pipe(map((categories) => !categories.length));
  }

  private initChartData(): void {
    this.chartData$ = this.categories$.pipe(
      map((categories) => [...categories].reverse()),
      map((categories) => ({
        labels: categories.map((category) => category.name),
        datasets: [
          {
            data: categories.map((category) => category.value),
            backgroundColor: categories.map((category) => category.hexColor),
          },
        ],
      }))
    );
  }

  private getChartOptions(): ChartOptions {
    const config: ChartOptions = {
      layout: {
        autoPadding: false,
      },
      elements: { arc: { borderColor: MainPalette.Charcoal } },
      plugins: {
        tooltip: {
          ...ChartJSTooltipConfig,
          callbacks: {
            label: (item) =>
              `${item.label} - ${this.currencyPipe.transform(this.numberSpacePipe.transform(item.parsed))}`,
            title: () => '',
          },
        },
        legend: {
          display: false,
        },
      },
    };

    if (isMobileWidth()) {
      return {
        ...config,
        animation: false,
      };
    }

    return config;
  }

  private initMenuActions(): void {
    switch (this.budgetType) {
      case BudgetType.Income:
        this.menuActions = [
          {
            icon: 'plus',
            translationKey: 'dashboard.categories.menu.addCategory',
            action: () => this.categoryModalsService.openAddIncomeCategoryModal(),
          },
          {
            icon: 'eraser',
            translationKey: 'dashboard.categories.menu.resetCategories',
            disabledObs: this.categoriesFacade.areIncomeCategoriesAllReset(),
            action: () =>
              this.confirmationModalService.openConfirmationModal(
                {
                  questionTranslationKey: this.buildTranslationKey(
                    'income.resetConfirmationQuestion'
                  ),
                },
                () => this.categoriesFacade.resetCategoriesByType(BudgetType.Income)
              ),
          },
        ];
        break;

      case BudgetType.Expense:
        this.menuActions = [
          {
            icon: 'plus',
            translationKey: 'dashboard.categories.menu.addCategory',
            action: () => this.categoryModalsService.openAddExpenseCategoryModal(),
          },
          {
            icon: 'eraser',
            translationKey: 'dashboard.categories.menu.resetCategories',
            disabledObs: this.categoriesFacade.areExpenseCategoriesAllReset(),
            action: () =>
              this.confirmationModalService.openConfirmationModal(
                {
                  questionTranslationKey: this.buildTranslationKey(
                    'expense.resetConfirmationQuestion'
                  ),
                },
                () => this.categoriesFacade.resetCategoriesByType(BudgetType.Expense)
              ),
          },
        ];
        break;
    }
  }
}
