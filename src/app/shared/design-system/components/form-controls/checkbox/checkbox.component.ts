import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  forwardRef,
  HostBinding,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { GenericCustomControlComponent } from '../generic-custom-control/generic-custom-control.component';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'checkbox',
  templateUrl: './checkbox.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class CheckboxComponent extends GenericCustomControlComponent {
  @HostBinding('class')
  private readonly classes = 'flex items-center gap-x-2 group cursor-default';

  @Input()
  set checked(value: boolean) {
    this.value = value;
  }

  @Input()
  indeterminate: boolean;

  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-native
  change = new EventEmitter<boolean>();

  @HostListener('click')
  override valueChanged() {
    this.value = !this.value;
    this.onChange(this.value);
    this.formControl.setValue(this.value, { emitEvent: false });
    this.formControl.updateValueAndValidity();
    this.change.emit(this.value as boolean);
  }
}
