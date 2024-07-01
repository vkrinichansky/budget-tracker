import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { ActivityLogFacadeService, RootValueActionType, RootValueChangeRecord } from '@budget-tracker/data';
import { ConfirmationModalService, ConfirmationModalTranslationData } from '@budget-tracker/design-system';
import { isPreviousMonth } from '@budget-tracker/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root-value-change-record',
  templateUrl: './root-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootValueChangeRecordComponent implements OnInit {
  readonly actionType = RootValueActionType;

  @Input()
  record: RootValueChangeRecord;

  isRecordRemoving$: Observable<boolean>;

  constructor(
    private confirmationModalService: ConfirmationModalService,
    private activityLogFacade: ActivityLogFacadeService
  ) {}

  ngOnInit(): void {
    this.isRecordRemoving$ = this.activityLogFacade.isActivityLogRecordRemoving(this.record.id);
  }

  buildTranslationKey(key: string): string {
    return `dashboard.activityLog.rootValueChangeRecord.${key}`;
  }

  removeHandler(): void {
    let translation: ConfirmationModalTranslationData = {
      questionTranslationKey: this.buildTranslationKey('removeConfirmationQuestion'),
    };

    if (!isPreviousMonth(this.record.date)) {
      translation = {
        ...translation,
        checkboxTranslationKey: this.buildTranslationKey('removeConfirmationCheckboxText'),
        remarkTranslationKey: this.buildTranslationKey(
          `removeConfirmationRemark.${this.record.valueType}.${this.record.actionType}`
        ),
        remarkTranslationParams: {
          value: this.record.actionType === RootValueActionType.Edit ? this.record.oldValue : this.record.value,
        },
      };
    }

    this.confirmationModalService.openConfirmationModal(
      translation,
      isPreviousMonth(this.record.date)
        ? () => this.activityLogFacade.removeRootValueChangeRecord(this.record.id)
        : (shouldRevertChangesMadeByRecord) =>
            this.activityLogFacade.removeRootValueChangeRecord(this.record.id, shouldRevertChangesMadeByRecord),
      !isPreviousMonth(this.record.date)
    );
  }
}
