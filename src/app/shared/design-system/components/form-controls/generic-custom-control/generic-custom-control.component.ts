import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  ValidationErrors,
  Validator,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { debounceTime, tap, Subscription, Subject, takeUntil } from 'rxjs';

type valueType = string | number | boolean | unknown;

enum CustomErrors {
  SAME_VALUE = 'sameValue',
  ENTITY_EXISTS = 'entityExists',
}

@Component({
  selector: 'app-generic-custom-control',
  template: '',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericCustomControlComponent
  implements ControlValueAccessor, Validator, OnInit, OnChanges, OnDestroy
{
  private _value: valueType;
  private valueChangesSubscription?: Subscription;
  private readonly destroy$ = new Subject<void>();

  readonly formControl: FormControl = new FormControl(null);

  @Input({ required: true })
  id: string;

  @Input()
  label: string;

  @Input()
  isRequired: boolean;

  @HostBinding('class.disabled')
  @Input()
  isDisabled: boolean;

  @Input()
  minValue: number;

  @Input()
  maxValue: number;

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

  get hasMaxValueError(): boolean {
    return this.formControl.hasError('max');
  }

  get hasIntegerError(): boolean {
    return this.formControl.hasError('integer');
  }

  get hasSameValueError(): boolean {
    return this.formControl.hasError(CustomErrors.SAME_VALUE);
  }

  get hasEntityExistsError(): boolean {
    return this.formControl.hasError(CustomErrors.ENTITY_EXISTS);
  }

  constructor(
    protected destroyRef: DestroyRef,
    protected cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.handleValidators();
    this.initFormControlListener();
  }

  ngOnChanges(): void {
    this.handleValidators();
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
    this.valueChangesSubscription?.unsubscribe();
    this.valueChangesSubscription = this.formControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(fn);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.valueChangesSubscription?.unsubscribe();
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

  private handleValidators() {
    const newValidators: ValidatorFn[] = [];

    if (this.isRequired) {
      newValidators.push(Validators.required);
    }

    if (this.minValue !== undefined) {
      newValidators.push(Validators.min(this.minValue));
    }

    if (this.maxValue !== undefined) {
      newValidators.push(Validators.max(this.maxValue));
    }

    this.formControl.setValidators(newValidators);
    this.formControl.updateValueAndValidity();
  }

  private initFormControlListener(): void {
    if (this.preventSameValue || this.entityExistsValidator) {
      this.formControl.valueChanges
        .pipe(
          debounceTime(150),
          tap((value) => {
            if (this.preventSameValue && this.initialValue == value) {
              this.formControl.setErrors({ [CustomErrors.SAME_VALUE]: true });
              this.cd.detectChanges();
            }

            if (this.entityExistsValidator && this.entityExistsValidator(value)) {
              this.formControl.setErrors({ [CustomErrors.ENTITY_EXISTS]: true });
              this.cd.detectChanges();
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe();
    }
  }
}
