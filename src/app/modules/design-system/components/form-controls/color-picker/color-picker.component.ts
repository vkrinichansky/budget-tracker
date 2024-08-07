import { ChangeDetectionStrategy, Component, Input, ViewChild, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { isMobileWidth } from '@budget-tracker/utils';
import { NgxColorsTriggerDirective } from 'ngx-colors';
import { GenericCustomControlComponent } from '../generic-custom-control/generic-custom-control.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'color-picker',
  templateUrl: './color-picker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ColorPickerComponent),
      multi: true,
    },
  ],
})
export class ColorPickerComponent extends GenericCustomControlComponent {
  private readonly classes = 'group';

  @ViewChild(NgxColorsTriggerDirective)
  private colorPicker: NgxColorsTriggerDirective;

  @Input()
  set color(value: string) {
    this.writeValue(value);
  }

  get isMobile(): boolean {
    return isMobileWidth();
  }

  onPanelClose(): void {
    if (!this.formControl.value) {
      this.formControl.markAsTouched;
    }
  }

  openPanel(): void {
    this.colorPicker.openPanel();
  }
}
