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
import { CategoryModalService } from '../../services';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ActionListenerService } from '@budget-tracker/utils';
import { CategoryActions } from '../../store';
import { CategoryFacadeService } from '../../services';
import { AccountFacadeService } from '@budget-tracker/account';
import { Category } from '@budget-tracker/models';

@Component({
  selector: 'app-category-item',
  templateUrl: './category-item.component.html',
  styleUrls: ['./category-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CategoryItemComponent implements OnInit {
  @Input({ required: true })
  category: Category;

  shouldDisableAddValueAction$: Observable<boolean>;
  menuActions: MenuAction[];

  @HostBinding('class.is-system-category')
  private get isSystemCategory(): boolean {
    return this.category?.isSystem;
  }

  constructor(
    private readonly categoryFacade: CategoryFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly categoryModalsService: CategoryModalService,
    private readonly accountFacade: AccountFacadeService,
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
    this.shouldDisableAddValueAction$ = this.accountFacade
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
        action: () => {
          this.confirmationModalService.openConfirmationModal(
            {
              questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
              questionTranslationParams: {
                categoryName: this.category.name,
              },
            },
            async () => {
              try {
                this.categoryFacade.removeCategory(this.category.id);

                await this.actionListener.waitForResult(
                  CategoryActions.categoryRemoved,
                  CategoryActions.removeCategoryFail,
                  (action) => action.categoryId === this.category.id,
                  (action) => action.categoryId === this.category.id
                );

                this.snackbarHandler.showCategoryRemovedSnackbar();
              } catch {
                this.snackbarHandler.showGeneralErrorSnackbar();
              }
            }
          );
        },
      },
    ];
  }
}
