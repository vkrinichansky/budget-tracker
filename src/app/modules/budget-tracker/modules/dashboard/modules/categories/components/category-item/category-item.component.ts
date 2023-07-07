import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { Category, CurrencyService } from '@budget-tracker/shared';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { Observable, takeUntil } from 'rxjs';
import { CategoriesFacadeService, CategoryModalsService } from '../../services';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class CategoryItemComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.categories.categoryItem';
  private readonly destroy$ = injectUnsubscriberService();

  @Input()
  categoryId: string;

  category: Category;

  menuActions: MenuAction[];

  currencySymbol$: Observable<string>;

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private cd: ChangeDetectorRef,
    private confirmationModalService: ConfirmationModalService,
    private categoryModalsService: CategoryModalsService,
    private currencyService: CurrencyService
  ) {}

  ngOnInit(): void {
    this.currencySymbol$ = this.currencyService.getCurrencySymbolObs();

    this.categoriesFacade
      .getCategoryById(this.categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => {
        this.category = category;
        this.initMenuActions();
        this.cd.detectChanges();
      });
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private initMenuActions(): void {
    this.menuActions = [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.addValue'),
        action: () => this.categoryModalsService.openCategoryValueModal(this.categoryId),
      },
      {
        icon: 'eraser',
        translationKey: this.buildTranslationKey('menu.resetValue'),
        disabled: this.category.value === 0,
        action: () =>
          this.confirmationModalService.openConfirmationModal(
            this.buildTranslationKey('confirmationModalReset'),
            {
              categoryName: this.category.name,
            },
            () => this.categoriesFacade.changeCategoryValue(this.categoryId, undefined, undefined, true)
          ),
      },
      {
        icon: 'close',
        translationKey: this.buildTranslationKey('menu.remove'),
        action: () =>
          this.confirmationModalService.openConfirmationModal(
            this.buildTranslationKey('confirmationModalRemove'),
            {
              categoryName: this.category.name,
            },
            () => this.categoriesFacade.removeCategory(this.categoryId)
          ),
      },
    ];
  }
}
