import {
  Component,
  Inject,
  OnInit,
  ChangeDetectionStrategy,
  AfterViewInit,
  inject,
  DestroyRef,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { filter, Observable, take, tap } from 'rxjs';
import { InfoCardMenuActionsType, InfoCardValueModalData, InfoCardValueToEdit } from '../../models';
import { RootValuesFacadeService } from '@budget-tracker/data';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

enum FormFields {
  Value = 'value',
  Note = 'note',
}

@Component({
  selector: 'app-info-card-value-modal',
  templateUrl: './info-card-value-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardValueModalComponent implements OnInit, AfterViewInit {
  private readonly rootTranslationKey = 'dashboard.infoCardValueModal';

  private readonly destroyRef = inject(DestroyRef);

  @ViewChild('valueInput')
  private valueInput: ElementRef;

  readonly formFields = FormFields;

  title: string;
  mainButtonText: string;
  isEditMode: boolean;

  loading$: Observable<boolean>;
  success$: Observable<boolean>;

  form: FormGroup;

  get initialValue(): number {
    return this.data.initialValue;
  }

  get isFormValid(): boolean {
    return this.form?.valid;
  }

  get hasRequiredError(): boolean {
    return this.form.controls[FormFields.Value].hasError('required');
  }

  get hasMinValueError(): boolean {
    return this.form.controls[FormFields.Value].hasError('min');
  }

  get hasMaxValueError(): boolean {
    return this.form.controls[FormFields.Value].hasError('max');
  }

  get hasEditError(): boolean {
    return this.form.controls[FormFields.Value].hasError('editError') && this.isEditMode;
  }

  get hasMaxLengthError(): boolean {
    return this.form.controls[FormFields.Note].hasError('maxlength');
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: InfoCardValueModalData,
    private dialogRef: MatDialogRef<InfoCardValueModalComponent>,
    private rootValuesFacade: RootValuesFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.title = this.buildTranslationKey(`${this.data.valueToEdit}.title`);
    this.mainButtonText = this.buildTranslationKey(`${this.data.valueToEdit}.${this.data.actionType}`);
    this.isEditMode = !!this.data.isEditMode;

    this.initForm();

    this.loading$ = this.rootValuesFacade.getValueUpdatingInProgress();
    this.success$ = this.rootValuesFacade.getValueUpdatingSuccess();

    this.success$
      .pipe(
        filter((isSuccess) => !!isSuccess),
        take(1)
      )
      .subscribe(() => this.dialogRef.close());
  }

  ngAfterViewInit(): void {
    if (this.isEditMode) {
      this.form.controls[FormFields.Value].setValue(this.data.initialValue);
    }

    this.valueInput.nativeElement.focus();
    this.cd.detectChanges();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  cancelClick(): void {
    this.dialogRef.close();
  }

  resolveSubmitAction(): void {
    const inputValue = parseInt(this.form.controls[FormFields.Value].value);
    const note = this.form.controls[FormFields.Note]?.value;

    switch (this.data.valueToEdit) {
      case InfoCardValueToEdit.Balance:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.rootValuesFacade.increaseBalance(inputValue, note);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.rootValuesFacade.decreaseBalance(inputValue, note);
            break;

          case InfoCardMenuActionsType.Edit:
            this.rootValuesFacade.editBalance(inputValue, note);
            break;
        }
        break;

      case InfoCardValueToEdit.Savings:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.rootValuesFacade.increaseSavings(inputValue, note);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.rootValuesFacade.decreaseSavings(inputValue, note);
            break;

          case InfoCardMenuActionsType.Edit:
            this.rootValuesFacade.editSavings(inputValue, note);
            break;
        }
        break;

      case InfoCardValueToEdit.FreeMoney:
        switch (this.data.actionType) {
          case InfoCardMenuActionsType.Increase:
            this.rootValuesFacade.increaseFreeMoney(inputValue, note);
            break;

          case InfoCardMenuActionsType.Decrease:
            this.rootValuesFacade.decreaseFreeMoney(inputValue, note);
            break;

          case InfoCardMenuActionsType.Edit:
            this.rootValuesFacade.editFreeMoney(inputValue, note);
            break;
        }
        break;
    }
  }

  private initForm(): void {
    const valueValidators = [Validators.required, Validators.min(this.isEditMode ? 0 : 1)];

    if (this.data.actionType === InfoCardMenuActionsType.Decrease) {
      valueValidators.push(Validators.max(this.data.initialValue));
    }

    this.form = new FormGroup({
      [FormFields.Value]: new FormControl(null, valueValidators),
      [FormFields.Note]: new FormControl('', [Validators.maxLength(100)]),
    });

    this.form.controls[FormFields.Value].valueChanges
      .pipe(
        filter((value) => parseInt(value) === this.data.initialValue && this.isEditMode),
        tap(() => {
          this.form.controls[FormFields.Value].setErrors({ editError: true });
          this.form.controls[FormFields.Value].markAsDirty();
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe();
  }
}
