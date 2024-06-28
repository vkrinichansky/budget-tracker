import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { CategoryModalsService } from '../../services';
import { CategoriesFacadeService, Category } from '@budget-tracker/data';
import { Observable, firstValueFrom } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  @HostBinding('class.pointer-events-none')
  isCategoryRemoving: boolean;

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private confirmationModalService: ConfirmationModalService,
    private categoryModalsService: CategoryModalsService,
    private destroyRef: DestroyRef,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.category$ = this.categoriesFacade.getCategoryById(this.categoryId);
    this.menuActions = this.initMenuActions();
    this.initIsCategoryRemoving();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.categories.categoryItem.${key}`;
  }

  private initIsCategoryRemoving(): void {
    this.categoriesFacade
      .isCategoryRemoving(this.categoryId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((isCategoryRemoving) => {
        this.isCategoryRemoving = isCategoryRemoving;
        this.cd.detectChanges();
      });
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
        icon: 'delete-bin',
        translationKey: this.buildTranslationKey('menu.remove'),
        action: async () => {
          const category = await firstValueFrom(this.category$);

          this.confirmationModalService.openConfirmationModal(
            {
              questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
              questionTranslationParams: {
                categoryName: category.name,
              },
              remarkTranslationKey: this.buildTranslationKey('removeConfirmationRemark'),
            },
            () => this.categoriesFacade.removeCategory(this.categoryId)
          );
        },
      },
    ];
  }
}
