import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, ViewChild, forwardRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup, FormControl, Validators, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { isMobileWidth } from '@budget-tracker/utils';
import { NgxColorsTriggerDirective, validColorValidator } from 'ngx-colors';

enum FormFields {
  ColorPicker = 'color-picker',
  ColorInput = 'color-input',
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  styleUrl: './color-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
})
export class ColorPickerComponent implements OnInit, ControlValueAccessor {
  @ViewChild(NgxColorsTriggerDirective)
  private colorPicker: NgxColorsTriggerDirective;

  private _value: string;

  readonly formFields = FormFields;

  readonly form: FormGroup = new FormGroup({
    [FormFields.ColorPicker]: new FormControl('', [Validators.required]),
    [FormFields.ColorInput]: new FormControl('', [Validators.required, validColorValidator()]),
  });

  @Input()
  label: string;

  @Input()
  set color(value: string) {
    this.writeValue(value);
  }

  set value(value: string) {
    this._value = value;
    this.form.controls[FormFields.ColorPicker].setValue(value, { emitEvent: false });
  }

  get value(): string {
    return this._value;
  }

  get isMobile(): boolean {
    return isMobileWidth();
  }

  constructor(private destroyRef: DestroyRef) {}

  registerOnTouched(): void {}
  setDisabledState?(): void {}

  ngOnInit(): void {
    this.initColorInputsBinding();
  }

  valueChanged(value: string) {
    this.onChange(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: string) => {};

  writeValue(value: string): void {
    this.value = value;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  clickOnColorPicker(): void {
    this.colorPicker.openPanel();
  }

  private initColorInputsBinding(): void {
    this.form.controls[FormFields.ColorPicker].valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((color) =>
        this.form.controls[FormFields.ColorInput].setValue(color, {
          emitEvent: false,
        })
      );
  }
}
