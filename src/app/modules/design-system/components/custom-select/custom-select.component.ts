import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'custom-select',
  templateUrl: './custom-select.component.html',
  styleUrl: './custom-select.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomSelectComponent),
      multi: true,
    },
  ],
})
export class CustomSelectComponent implements ControlValueAccessor {
  private _value: unknown;

  readonly formControl = new FormControl(null, [Validators.required]);

  @Input()
  label: string;

  @Input()
  options: unknown[];

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  idSelector: (option: any) => string;

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  displayValueSelector: (option: any) => string;

  @Input()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  iconSelector: (option: any) => string;

  @Input()
  set option(value: unknown) {
    this.writeValue(value);
  }

  set value(value: unknown) {
    this._value = value;
    this.formControl.setValue(value, { emitEvent: false });
  }

  get value(): unknown {
    return this._value;
  }

  get hasRequiredError(): boolean {
    return this.formControl.hasError('required');
  }

  registerOnTouched(): void {}
  setDisabledState?(): void {}

  valueChanged(value: unknown) {
    this.onChange(value);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onChange = (value: unknown) => {};

  writeValue(value: unknown): void {
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
    ];
  }
}
