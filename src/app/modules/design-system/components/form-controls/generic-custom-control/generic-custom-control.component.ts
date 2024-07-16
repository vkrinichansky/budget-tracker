import { Component, DestroyRef, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, FormControl, Validators } from '@angular/forms';
import { tap } from 'rxjs';

type valueType = string | number | unknown;

@Component({
  selector: 'app-generic-custom-control',
  template: '',
})
export class GenericCustomControlComponent implements ControlValueAccessor, OnInit {
  private _value: valueType;

  readonly formControl: FormControl = new FormControl(null);

  @Input()
  label: string;

  @Input()
  required: boolean;

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
    return this.formControl.hasError('sameValue');
  }

  get hasEntityExistsError(): boolean {
    return this.formControl.hasError('entityExists');
  }

  constructor(protected destroyRef: DestroyRef) {}

  ngOnInit(): void {
    this.handleValidators();
    this.initFormControlListener();
  }

  handleValidators() {
    if (this.required) {
      this.formControl.addValidators(Validators.required);
    }

    if (this.minValue !== undefined) {
      this.formControl.addValidators(Validators.min(this.minValue));
    }
  }

  registerOnTouched(): void {}
  setDisabledState?(): void {}

  valueChanged(value: valueType) {
    this.onChange(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: valueType) => {};

  writeValue(value: valueType): void {
    this.value = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  isErrorState(): boolean {
    const control = this.formControl;

    return !!(
      (control && control.invalid && (control.dirty || control.touched)) ||
      (control && control.value && control.invalid && (control.pristine || control.untouched))
    );
  }

  private initFormControlListener(): void {
    if (this.preventSameValue || this.entityExistsValidator) {
      this.formControl.valueChanges
        .pipe(
          tap((value) => {
            if (this.preventSameValue && this.initialValue == value) {
              this.formControl.setErrors({ sameValue: true });
            }

            if (this.entityExistsValidator && this.entityExistsValidator(value)) {
              this.formControl.setErrors({ entityExists: true });
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }
}
