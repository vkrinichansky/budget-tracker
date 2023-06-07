import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { Category } from '@budget-tracker/shared';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';
import { CategoryModalsService } from '../../../../services';

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

  menuActions: MenuAction[] = [
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
          () => this.btFacade.changeCategoryValue(this.categoryId, undefined, undefined, true)
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
          () => this.btFacade.removeCategory(this.categoryId)
        ),
    },
  ];

  constructor(
    private btFacade: BudgetTrackerFacadeService,
    private cd: ChangeDetectorRef,
    private translateService: TranslateService,
    private confirmationModalService: ConfirmationModalService,
    private categoryModalsService: CategoryModalsService
  ) {}

  ngOnInit(): void {
    this.btFacade
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
