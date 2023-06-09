import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { Category } from '@budget-tracker/shared';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { CategoriesFacadeService, CategoryModalsService } from '../../services';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class CategoryItemComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.categories.categoryItem';
  private readonly destroy$ = injectUnsubscriberService();

  @HostBinding('class')
  private readonly classes =
    'flex justify-between items-center p-5 pr-2 border-solid border-2 border-grey rounded-lg hover:border-charcoal';

  @Input()
  categoryId: string;

  category: Category;

  readonly menuActions: MenuAction[] = [
    {
      icon: 'plus',
      text: this.translateService.instant(this.buildTranslationKey('menu.addValue')),
      action: () => this.categoryModalsService.openCategoryValueModal(this.categoryId),
    },
    {
      icon: 'eraser',
      text: this.translateService.instant(this.buildTranslationKey('menu.resetValue')),
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
      text: this.translateService.instant(this.buildTranslationKey('menu.remove')),
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

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
    private confirmationModalService: ConfirmationModalService,
    private categoryModalsService: CategoryModalsService
  ) {}

  ngOnInit(): void {
    this.categoriesFacade
      .getCategoryById(this.categoryId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((category) => {
        this.category = category;
        this.cd.detectChanges();
      });
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
