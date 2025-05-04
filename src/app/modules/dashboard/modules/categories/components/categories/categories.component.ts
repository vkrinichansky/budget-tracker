import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CategoryModalsService } from '../../services';
import {
  ConfirmationModalService,
  getPieChartConfig,
  MenuAction,
  NumberSpacePipe,
  PieChartOptions,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { CategoriesFacadeService } from '../../../../services';
import { ActionListenerService } from '@budget-tracker/utils';
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

  @Input()
  budgetType: BudgetType;

  title: string;
  menuActions: MenuAction[];

  categories$: Observable<Category[]>;
  isEmpty$: Observable<boolean>;
  areAllCategoriesReset$: Observable<boolean>;
  chartOptions$: Observable<PieChartOptions>;

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
    this.chartOptions$ = this.categories$.pipe(
      map((categories) => [...categories].reverse()),
      map((categories) =>
        getPieChartConfig(
          categories.map((category) => category.value),
          categories.map((category) => this.translateService.instant(category.name)),
          categories.map((category) => category.hexColor),
          (label, value) =>
            `${label} - ${this.currencyPipe.transform(this.numberSpacePipe.transform(value))}`
        )
      )
    );
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
              try {
                this.categoriesFacade.resetCategoriesByType(this.budgetType);

                await this.actionListener.waitForResult(
                  CategoriesActions.categoriesReset,
                  CategoriesActions.resetCategoriesFail
                );

                this.snackbarHandler.showCategoriesResetSnackbar(this.budgetType);
              } catch {
                this.snackbarHandler.showGeneralErrorSnackbar();
              }
            }
          ),
      },
    ];
  }
}
