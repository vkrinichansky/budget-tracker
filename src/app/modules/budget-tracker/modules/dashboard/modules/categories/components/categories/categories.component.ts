import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { BudgetType, Category } from '@budget-tracker/data';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoryModalsService } from '../../services';
import { ChartJSTooltipConfig, CoralChartPalette, MainPalette, MintChartPalette } from '@budget-tracker/design-system';
import { CategoriesFacadeService } from '@budget-tracker/data';
import { CurrencyPipe } from '@budget-tracker/shared';

type TabType = 'list' | 'chart';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoriesComponent implements OnInit {
  @HostBinding('class')
  private readonly classes = 'w-full h-full bg-transparent rounded-lg overflow-hidden p-5 bg-white';

  readonly currentTab$: BehaviorSubject<TabType> = new BehaviorSubject<TabType>('list');

  @Input()
  budgetType: BudgetType;

  title: string;
  chartOptions: ChartOptions;
  palette: string[];
  addButtonAction: () => void;

  categories$: Observable<Category[]>;
  isEmpty$: Observable<boolean>;
  areAllCategoriesReset$: Observable<boolean>;
  chartData$: Observable<ChartData>;

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private categoryModalsService: CategoryModalsService,
    private currencyPipe: CurrencyPipe
  ) {}

  ngOnInit(): void {
    this.title = this.buildTranslationKey(`${this.budgetType}.title`);
    this.palette = this.getPalette();
    this.chartOptions = this.getChartOptions();

    this.initDataAccordingBudgetType();
    this.initIsEmptyListener();
    this.initChartData();
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

        this.addButtonAction = () => this.categoryModalsService.openAddIncomeCategoryModal();
        this.areAllCategoriesReset$ = this.categoriesFacade.areIncomeCategoriesAllReset();
        break;

      case BudgetType.Expense:
        this.categories$ = this.categoriesFacade
          .getExpenseCategories()
          .pipe(map((categories) => categories.sort((a, b) => b.value - a.value)));

        this.addButtonAction = () => this.categoryModalsService.openAddExpenseCategoryModal();
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
            backgroundColor: this.palette,
          },
        ],
      }))
    );
  }

  private getBorderColor(): string {
    switch (this.budgetType) {
      case BudgetType.Income:
        return MainPalette.DarkGreen;

      case BudgetType.Expense:
        return MainPalette.Red;
    }
  }

  private getPalette(): string[] {
    switch (this.budgetType) {
      case BudgetType.Income:
        return MintChartPalette;

      case BudgetType.Expense:
        return CoralChartPalette;
    }
  }

  private getChartOptions(): ChartOptions {
    const borderColor = this.getBorderColor();

    return {
      layout: {
        autoPadding: false,
      },
      elements: { arc: { borderColor: borderColor } },
      plugins: {
        tooltip: {
          ...ChartJSTooltipConfig,
          callbacks: {
            label: (item) => `${item.label} - ${this.currencyPipe.transform(item.parsed)}`,
            title: () => '',
          },
        },
        legend: {
          display: false,
        },
      },
    };
  }
}
