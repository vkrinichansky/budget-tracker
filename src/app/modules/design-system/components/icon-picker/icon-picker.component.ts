import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'icon-picker',
  templateUrl: './icon-picker.component.html',
  styleUrl: './icon-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IconPickerComponent),
      multi: true,
    },
  ],
})
export class IconPickerComponent implements ControlValueAccessor {
  private _value: string;

  readonly formControl = new FormControl(null, [Validators.required]);

  readonly icons = this.getIcons();
  @Input()
  label: string;

  @Input()
  set color(value: string) {
    this.writeValue(value);
  }

  set value(value: string) {
    this._value = value;
    this.formControl.setValue(value, { emitEvent: false });
  }

  get value(): string {
    return this._value;
  }

  get hasRequiredError(): boolean {
    return this.formControl.hasError('required');
  }

  registerOnTouched(): void {}
  setDisabledState?(): void {}

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

  private getIcons(): string[] {
    return [
      'home',
      'basket',
      'pill',
      'clothes',
      'entertainment',
      'bus',
      'car',
      'bath',
      'rest',
      'work',
      'cake',
      'lamp',
      'laptop',
      'internet',
      'tv',
      'flower',
      'heart',
      'card-dollar',
      'card-euro',
      'creditcard',
      'money-multiple',
      'safe',
      'wallet',
    ];
  }
}
