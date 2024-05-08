import { ChangeDetectionStrategy, Component, HostListener, Input, OnInit } from '@angular/core';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { CategoryModalsService } from '../../services';
import { CategoriesFacadeService, Category } from '@budget-tracker/data';
import { Observable, firstValueFrom, map } from 'rxjs';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryItemComponent implements OnInit {
  @Input()
  categoryId: string;

  category$: Observable<Category>;

  menuActions: MenuAction[];

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private confirmationModalService: ConfirmationModalService,
    private categoryModalsService: CategoryModalsService
  ) {}

  ngOnInit(): void {
    this.category$ = this.categoriesFacade.getCategoryById(this.categoryId);
    this.menuActions = this.initMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.categories.categoryItem.${key}`;
  }

  @HostListener('click')
  private openCategoryValueModal(): void {
    this.categoryModalsService.openCategoryValueModal(this.categoryId);
  }

  private initMenuActions(): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.addValue'),
        action: () => this.openCategoryValueModal(),
      },
      {
        icon: 'eraser',
        translationKey: this.buildTranslationKey('menu.resetValue'),
        disabledObs: this.category$.pipe(map((category) => category.value === 0)),
        action: async () => {
          const category = await firstValueFrom(this.category$);

          this.confirmationModalService.openConfirmationModal(
            this.buildTranslationKey('confirmationModalReset'),
            {
              categoryName: category.name,
            },
            () => this.categoriesFacade.changeCategoryValue(this.categoryId, undefined, undefined, true)
          );
        },
      },
      {
        icon: 'close',
        translationKey: this.buildTranslationKey('menu.remove'),
        action: async () => {
          const category = await firstValueFrom(this.category$);

          this.confirmationModalService.openConfirmationModal(
            this.buildTranslationKey('confirmationModalRemove'),
            {
              categoryName: category.name,
            },
            () => this.categoriesFacade.removeCategory(this.categoryId)
          );
        },
      },
    ];
  }
}
