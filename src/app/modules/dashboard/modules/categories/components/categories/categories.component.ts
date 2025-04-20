import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { ChartData, ChartOptions } from 'chart.js';
import { CategoryModalsService } from '../../services';
import {
  ChartJSTooltipConfig,
  ConfirmationModalService,
  MainPalette,
  MenuAction,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { CategoriesFacadeService } from '../../../../services';
import { ActionListenerService, isMobileWidth, NumberSpacePipe } from '@budget-tracker/utils';
import { BudgetType, Category } from '@budget-tracker/models';
import { CurrencyPipe } from '@budget-tracker/metadata';
import { CategoriesActions } from '../../../../store';
import { TranslateService } from '@ngx-translate/core';

type TabType = 'list' | 'chart';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoriesComponent implements OnInit {
  readonly currentTab$ = new BehaviorSubject<TabType>('list');
  readonly loading$ = new BehaviorSubject<boolean>(false);

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
    private readonly categoriesFacade: CategoriesFacadeService,
    private readonly categoryModalsService: CategoryModalsService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly numberSpacePipe: NumberSpacePipe,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly actionListener: ActionListenerService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.title = `dashboard.categories.${this.budgetType}.title`;
    this.chartOptions = this.getChartOptions();

    this.initData();
    this.initChartData();
    this.initMenuActions();
  }

  trackBy(_: number, category: Category): string {
    return category.id;
  }

  setTab(value: TabType): void {
    this.currentTab$.next(value);
  }

  private initData(): void {
    this.categories$ = this.categoriesFacade
      .getCategoriesByType(this.budgetType)
      .pipe(map((categories) => categories.sort((a, b) => b.value - a.value)));

    this.areAllCategoriesReset$ = this.categoriesFacade.areCategoriesAllReset(this.budgetType);
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
              `${this.translateService.instant(item.label)} - ${this.currencyPipe.transform(this.numberSpacePipe.transform(item.parsed))}`,
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
    this.menuActions = [
      {
        icon: 'plus',
        translationKey: 'dashboard.categories.menu.addCategory',
        action: () => this.categoryModalsService.openAddCategoryModal(this.budgetType),
      },
      {
        icon: 'eraser',
        translationKey: 'dashboard.categories.menu.resetCategories',
        disabledObs: this.categoriesFacade.areCategoriesAllReset(this.budgetType),
        action: () =>
          this.confirmationModalService.openConfirmationModal(
            {
              questionTranslationKey: `dashboard.categories.${this.budgetType}.resetConfirmationQuestion`,
            },
            async () => {
              this.loading$.next(true);

              try {
                this.categoriesFacade.resetCategoriesByType(this.budgetType);
                this.snackbarHandler.showCategoriesResetSnackbar(this.budgetType);

                await this.actionListener.waitForResult(
                  CategoriesActions.categoriesReset,
                  CategoriesActions.resetCategoriesFail
                );
              } catch {
                this.snackbarHandler.showGeneralErrorSnackbar();
              } finally {
                this.loading$.next(false);
              }
            }
          ),
      },
    ];
  }
}
