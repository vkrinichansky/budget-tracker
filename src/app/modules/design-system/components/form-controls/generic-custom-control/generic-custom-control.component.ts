import { ChangeDetectorRef, Component, DestroyRef, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
  Validator,
  Validators,
} from '@angular/forms';
import { debounceTime, tap } from 'rxjs';

type valueType = string | number | boolean | unknown;

enum CustomErrors {
  SameValue = 'sameValue',
  EntityExists = 'entityExists',
}

@Component({
  selector: 'app-generic-custom-control',
  template: '',
})
export class GenericCustomControlComponent implements ControlValueAccessor, Validator, OnInit {
  private _value: valueType;

  readonly formControl: FormControl = new FormControl(null);

  @Input({ required: true })
  id: string;

  @Input()
  label: string;

  @Input()
  isRequired: boolean;

  @Input()
  minValue: number;

  @Input()
  maxLength: number;

  @Input()
  displayCharCounter: boolean;

  @Input()
  preventSameValue: boolean;

  @Input()
  initialValue: string | number;

  @Input()
  entityExistsValidator: (value: string) => boolean;

  set value(value: valueType) {
    this._value = value;
    this.formControl.setValue(value, { emitEvent: false });
  }

  get value(): valueType {
    return this._value;
  }

  get hasRequiredError(): boolean {
    return this.formControl.hasError('required');
  }

  get hasMinValueError(): boolean {
    return this.formControl.hasError('min');
  }

  get hasIntegerError(): boolean {
    return this.formControl.hasError('integer');
  }

  get hasSameValueError(): boolean {
    return this.formControl.hasError(CustomErrors.SameValue);
  }

  get hasEntityExistsError(): boolean {
    return this.formControl.hasError(CustomErrors.EntityExists);
  }

  constructor(
    protected destroyRef: DestroyRef,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.handleValidators();
    this.initFormControlListener();
  }

  handleValidators() {
    if (this.isRequired) {
      this.formControl.addValidators(Validators.required);
    }

    if (this.minValue !== undefined) {
      this.formControl.addValidators(Validators.min(this.minValue));
    }
  }

  valueChanged(value: valueType) {
    this.onChange(value);
  }

  writeValue(value: valueType): void {
    this.value = value;
  }

  validate(): ValidationErrors | null {
    return this.formControl.errors;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
    this.formControl.valueChanges.subscribe(fn);
  }

  isErrorState(): boolean {
    const control = this.formControl;

    return !!(
      (control && control.invalid && (control.dirty || control.touched)) ||
      (control && control.value && control.invalid && (control.pristine || control.untouched))
    );
  }

  registerOnTouched(): void {}
  setDisabledState?(): void {}
  registerOnValidatorChange?(): void {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: valueType) => {};

  private initFormControlListener(): void {
    if (this.preventSameValue || this.entityExistsValidator) {
      this.formControl.valueChanges
        .pipe(
          debounceTime(150),
          tap((value) => {
            if (this.preventSameValue && this.initialValue == value) {
              this.formControl.setErrors({ [CustomErrors.SameValue]: true });
              this.cd.detectChanges();
            }

            if (this.entityExistsValidator && this.entityExistsValidator(value)) {
              this.formControl.setErrors({ [CustomErrors.EntityExists]: true });
              this.cd.detectChanges();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }
}
