import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, ActivityLogRecordType } from '@budget-tracker/data';
import { CheckboxGroup, ConfirmationModalService } from '@budget-tracker/design-system';
import { BehaviorSubject, Observable, map } from 'rxjs';

@Component({
  selector: 'app-activity-log-remove-menu',
  templateUrl: './activity-log-remove-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogRemoveMenuComponent implements OnInit {
  readonly menuClosed$ = new BehaviorSubject<boolean>(true);

  readonly checkboxGroup: CheckboxGroup = {
    nameOrTranslationKey: this.buildTranslationKey('allTypes'),
    checked: false,
    subItems: [
      // {
      //   nameOrTranslationKey: this.buildTranslationKey('categoryManagement'),
      //   checked: false,
      //   value: ActivityLogRecordType.CategoryManagement,
      //   infoIconType: 'info',
      // },
      {
        nameOrTranslationKey: this.buildTranslationKey('categoriesReset'),
        checked: false,
        value: ActivityLogRecordType.CategoriesReset,
        infoIconType: 'info',
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('categoryValueChange'),
        checked: false,
        value: ActivityLogRecordType.CategoryValueChange,
        infoIconType: 'info',
      },
      // {
      //   nameOrTranslationKey: this.buildTranslationKey('accountManagement'),
      //   checked: false,
      //   value: ActivityLogRecordType.AccountManagement,
      //   infoIconType: 'info',
      // },
      {
        nameOrTranslationKey: this.buildTranslationKey('accountValueEdit'),
        checked: false,
        value: ActivityLogRecordType.AccountValueEdit,
        infoIconType: 'info',
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('moveMoneyBetweenAccounts'),
        checked: false,
        value: ActivityLogRecordType.MoveMoneyBetweenAccounts,
        infoIconType: 'info',
      },
    ],
  };

  @Input()
  disabled: boolean;

  checkboxGroup$: Observable<CheckboxGroup>;

  constructor(
    private activityLogFacade: ActivityLogFacadeService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.initCheckboxGroup();
  }

  setMenuClosed(value: boolean): void {
    this.menuClosed$.next(value);
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.removeMenu.${key}`;
  }

  removeRecordsWithSelectedTypes(checkboxGroup: CheckboxGroup): void {
    this.setMenuClosed(true);

    const selectedTypes: ActivityLogRecordType[] = checkboxGroup.subItems
      .filter((item) => item.checked)
      .map((item) => item.value as ActivityLogRecordType);

    if (checkboxGroup.subItems.some((item) => item.checked)) {
      this.confirmationModalService.openConfirmationModal(
        {
          questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
          remarkTranslationKey: this.buildTranslationKey('removeConfirmationRemark'),
        },
        () => this.activityLogFacade.removeRecordsBySelectedTypes(selectedTypes)
      );
    }
  }

  private initCheckboxGroup(): void {
    this.checkboxGroup$ = this.activityLogFacade.getActivityLogTypes().pipe(
      map((types) => ({
        ...this.checkboxGroup,
        subItems: this.checkboxGroup.subItems.filter((item) =>
          types.includes(item.value as ActivityLogRecordType)
        ),
      }))
    );
  }
}
