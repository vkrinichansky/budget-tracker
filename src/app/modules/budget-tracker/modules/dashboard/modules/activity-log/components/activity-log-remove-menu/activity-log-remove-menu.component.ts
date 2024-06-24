import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, ActivityLogRecordType } from '@budget-tracker/data';
import { CheckboxGroup } from '@budget-tracker/design-system';
import { Observable, map } from 'rxjs';

@Component({
  selector: 'app-activity-log-remove-menu',
  templateUrl: './activity-log-remove-menu.component.html',
  styleUrl: './activity-log-remove-menu.component.scss',
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
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('categoriesReset.text'),
        checked: false,
        value: ActivityLogRecordType.CategoriesReset,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('categoriesReset.tooltip'),
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('rootValueChange.text'),
        checked: false,
        value: ActivityLogRecordType.RootValueChange,
        infoIconType: 'info',
        tooltipTranslationKey: this.buildTranslationKey('rootValueChange.tooltip'),
      },
      {
        nameOrTranslationKey: this.buildTranslationKey('categoryValueChange.text'),
        checked: false,
        value: ActivityLogRecordType.CategoryValueChange,
        infoIconType: 'warning',
        tooltipTranslationKey: this.buildTranslationKey('categoryValueChange.tooltip'),
      },
    ],
  };

  @Input()
  disabled: boolean;

  checkboxGroup$: Observable<CheckboxGroup>;

  constructor(private activityLogFacade: ActivityLogFacadeService) {}

  ngOnInit(): void {
    this.checkboxGroup$ = this.activityLogFacade.getActivityLogTypes().pipe(
      map((types) => ({
        ...this.checkboxGroup,
        subItems: this.checkboxGroup.subItems.filter((item) => types.includes(item.value as ActivityLogRecordType)),
      }))
    );
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.removeMenu.${key}`;
  }

  removeRecordsWithSelectedTypes(checkboxGroup: CheckboxGroup): void {
    const selectedTypes: ActivityLogRecordType[] = checkboxGroup.subItems
      .filter((item) => item.checked)
      .map((item) => item.value as ActivityLogRecordType);

    if (checkboxGroup.subItems.some((item) => item.checked)) {
      this.activityLogFacade.removeRecordsBySelectedTypes(selectedTypes, checkboxGroup.checked);
    }
  }
}
