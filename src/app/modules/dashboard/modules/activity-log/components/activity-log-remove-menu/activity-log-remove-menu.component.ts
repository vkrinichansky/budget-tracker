import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, ActivityLogRecordType } from '@budget-tracker/data';
import {
  CheckboxGroup,
  ConfirmationModalService,
  TooltipPosition,
} from '@budget-tracker/design-system';
import { isMobileWidth } from '@budget-tracker/utils';
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
      {
        nameOrTranslationKey: this.buildTranslationKey('categoryManagement.text'),
        checked: false,
        value: ActivityLogRecordType.CategoryManagement,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('categoryManagement.tooltip'),
        tooltipPosition: this.tooltipPosition,
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('categoriesReset.text'),
        checked: false,
        value: ActivityLogRecordType.CategoriesReset,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('categoriesReset.tooltip'),
        tooltipPosition: this.tooltipPosition,
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('categoryValueChange.text'),
        checked: false,
        value: ActivityLogRecordType.CategoryValueChange,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('categoryValueChange.tooltip'),
        tooltipPosition: this.tooltipPosition,
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('accountManagement.text'),
        checked: false,
        value: ActivityLogRecordType.AccountManagement,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('accountManagement.tooltip'),
        tooltipPosition: this.tooltipPosition,
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('accountValueEdit.text'),
        checked: false,
        value: ActivityLogRecordType.AccountValueEdit,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('accountValueEdit.tooltip'),
        tooltipPosition: this.tooltipPosition,
      },
    ],
  };

  @Input()
  disabled: boolean;

  checkboxGroup$: Observable<CheckboxGroup>;

  private get tooltipPosition(): TooltipPosition {
    return isMobileWidth() ? 'right' : 'top';
  }

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
