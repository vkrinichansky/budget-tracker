import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  ConfirmationModalService,
  MenuAction,
  SnackbarHandlerService,
} from '@budget-tracker/design-system';
import { CategoryModalsService } from '../../services';
import { AccountsFacadeService, CategoriesFacadeService } from '../../../../services';
import { BehaviorSubject, Observable, firstValueFrom, map } from 'rxjs';
import { Category } from '@budget-tracker/models';
import { ActionListenerService } from '@budget-tracker/utils';
import { CategoriesActions } from '../../../../store';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoryItemComponent implements OnInit {
  readonly loading$ = new BehaviorSubject<boolean>(false);

  @Input({ required: true })
  category: Category;

  shouldDisableAddValueAction$: Observable<boolean>;
  menuActions: MenuAction[];

  @HostBinding('class.is-system-category')
  private get isSystemCategory(): boolean {
    return this.category?.isSystem;
  }

  @HostBinding('class.pointer-events-none')
  private get isCategoryRemoving(): boolean {
    return this.loading$.value;
  }

  constructor(
    private readonly categoriesFacade: CategoriesFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly categoryModalsService: CategoryModalsService,
    private readonly accountsFacade: AccountsFacadeService,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initListeners();
    this.menuActions = this.initMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.categories.categoryItem.${key}`;
  }

  private initListeners(): void {
    this.shouldDisableAddValueAction$ = this.accountsFacade
      .getAccountsExist()
      .pipe(map((accountsExist) => !accountsExist));
  }

  @HostListener('click')
  private async openCategoryValueModal(): Promise<void> {
    if (!(await firstValueFrom(this.shouldDisableAddValueAction$))) {
      this.categoryModalsService.openCategoryValueModal(this.category.id);
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
          this.confirmationModalService.openConfirmationModal(
            {
              questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
              questionTranslationParams: {
                categoryName: this.category.name,
              },
            },
            async () => {
              this.loading$.next(true);

              try {
                this.categoriesFacade.removeCategory(this.category.id);

                await this.actionListener.waitForResult(
                  CategoriesActions.categoryRemoved,
                  CategoriesActions.removeCategoryFail,
                  (action) => action.categoryId === this.category.id,
                  (action) => action.categoryId === this.category.id
                );

                this.snackbarHandler.showCategoryRemovedSnackbar();
              } catch {
                this.snackbarHandler.showGeneralErrorSnackbar();
              } finally {
                this.loading$.next(false);
              }
            }
          );
        },
      },
    ];
  }
}
