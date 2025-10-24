import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { CategoryFacadeService, CategoryModalService } from '../../services';
import {
  ConfirmationModalService,
  getPieChartConfig,
  MenuAction,
  NumberSpacePipe,
  PieChartOptions,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { getErrorMessage } from '@budget-tracker/shared-utils';
import { BudgetType } from '@budget-tracker/shared-models';
import { CurrencyPipe } from '@budget-tracker/metadata';
import { TranslateService } from '@ngx-translate/core';
import { Category } from '../../models';

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
    private readonly categoryFacade: CategoryFacadeService,
    private readonly categoryModalsService: CategoryModalService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly numberSpacePipe: NumberSpacePipe,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.title = `category.${this.budgetType}.title`;

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
    this.categories$ = this.categoryFacade.getCategoriesByType(this.budgetType).pipe(
      map((categories) =>
        categories.sort((a, b) => {
          if (a.isSystem && !b.isSystem) return 1;
          if (!a.isSystem && b.isSystem) return -1;

          return b.value - a.value;
        })
      )
    );

    this.areAllCategoriesReset$ = this.categoryFacade.areCategoriesAllReset(this.budgetType);
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
        translationKey: 'category.menu.addCategory',
        action: () => this.categoryModalsService.openAddCategoryModal(this.budgetType),
      },
      {
        icon: 'eraser',
        translationKey: 'category.menu.resetCategories',
        disabledObs: this.categoryFacade.areCategoriesAllReset(this.budgetType),
        action: () =>
          this.confirmationModalService.openConfirmationModal(
            {
              questionTranslationKey: `category.${this.budgetType}.resetConfirmationQuestion`,
            },
            async () => {
              try {
                await this.categoryFacade.runResetCategoriesFlow(this.budgetType);

                this.snackbarHandler.showMessageSnackbar(
                  `messages.category.categoriesReset.${this.budgetType}`
                );
              } catch (error) {
                this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
              }
            }
          ),
      },
    ];
  }
}
