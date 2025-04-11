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
import { AccountsFacadeService, CategoriesFacadeService } from '@budget-tracker/data';
import { Observable, firstValueFrom, map } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Category } from '@budget-tracker/models';

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
  shouldDisableAddValueAction$: Observable<boolean>;

  menuActions: MenuAction[];

  @HostBinding('class.pointer-events-none')
  isCategoryRemoving: boolean;

  constructor(
    private categoriesFacade: CategoriesFacadeService,
    private confirmationModalService: ConfirmationModalService,
    private categoryModalsService: CategoryModalsService,
    private destroyRef: DestroyRef,
    private cd: ChangeDetectorRef,
    private accountsFacade: AccountsFacadeService
  ) {}

  ngOnInit(): void {
    this.initListeners();
    this.menuActions = this.initMenuActions();
    this.initIsCategoryRemoving();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.categories.categoryItem.${key}`;
  }

  private initListeners(): void {
    this.category$ = this.categoriesFacade.getCategoryById(this.categoryId);
    this.shouldDisableAddValueAction$ = this.accountsFacade
      .getAccountsExist()
      .pipe(map((accountsExist) => !accountsExist));
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
  private async openCategoryValueModal(): Promise<void> {
    if (!(await firstValueFrom(this.shouldDisableAddValueAction$))) {
      this.categoryModalsService.openCategoryValueModal(this.categoryId);
    }
  }

  private initMenuActions(): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.addValue'),
        disabledObs: this.shouldDisableAddValueAction$,
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
            },
            () => this.categoriesFacade.removeCategory(this.categoryId)
          );
        },
      },
    ];
  }
}
