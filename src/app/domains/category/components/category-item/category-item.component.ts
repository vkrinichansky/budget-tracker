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
import { CategoryFacadeService } from '../../services';
import { Category, CategoryEvents, OpenCategoryTransactionModalEvent } from '../../models';
import { EventBusService, getErrorMessage } from '@budget-tracker/shared-utils';

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

  menuActions: MenuAction[];

  @HostBinding('class.is-system-category')
  private get isSystemCategory(): boolean {
    return this.category?.isSystem;
  }

  constructor(
    private readonly categoryFacade: CategoryFacadeService,
    private readonly confirmationModalService: ConfirmationModalService,
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly eventBusService: EventBusService
  ) {}

  ngOnInit(): void {
    this.menuActions = this.initMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `category.categoryItem.${key}`;
  }

  @HostListener('click')
  private async openCategoryTransactionModal(): Promise<void> {
    this.eventBusService.emit<OpenCategoryTransactionModalEvent>({
      status: 'event',
      type: CategoryEvents.OPEN_CATEGORY_TRANSACTION_MODAL,
      payload: {
        categoryId: this.category.id,
      },
    });
  }

  private initMenuActions(): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.addValue'),
        action: () => this.openCategoryTransactionModal(),
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
                await this.categoryFacade.removeCategory(this.category.id);

                this.snackbarHandler.showMessageSnackbar('messages.category.categoryRemoved');
              } catch (error) {
                this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
              }
            }
          );
        },
      },
    ];
  }
}
