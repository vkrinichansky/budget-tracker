import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, ActivityLogRecordType } from '@budget-tracker/data';
import { CheckboxGroup, ConfirmationModalService, TooltipPosition } from '@budget-tracker/design-system';
import { isMobileWidth } from '@budget-tracker/utils';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-activity-log-remove-menu',
  templateUrl: './activity-log-remove-menu.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActivityLogRemoveMenuComponent implements OnInit {
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
        nameOrTranslationKey: this.buildTranslationKey('rootValueChange.text'),
        checked: false,
        value: ActivityLogRecordType.RootValueChange,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('rootValueChange.tooltip'),
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

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.removeMenu.${key}`;
  }

  removeRecordsWithSelectedTypes(checkboxGroup: CheckboxGroup): void {
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
        subItems: this.checkboxGroup.subItems.filter((item) => types.includes(item.value as ActivityLogRecordType)),
      }))
    );
  }
}
