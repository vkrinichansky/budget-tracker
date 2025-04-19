import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  Renderer2,
  ViewChild,
  forwardRef,
  inject,
} from '@angular/core';
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
  standalone: false,
})
export class ColorPickerComponent extends GenericCustomControlComponent {
  private readonly classes = 'group';

  private readonly renderer = inject(Renderer2);

  @ViewChild(NgxColorsTriggerDirective)
  private colorPicker: NgxColorsTriggerDirective;

  @ViewChild('colorPicker')
  private colorPickerTrigger: ElementRef;

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

  onPanelOpen(): void {
    const panel = document.querySelector('ngx-colors-panel .opened');
    const triggerWidth = this.colorPickerTrigger.nativeElement.offsetWidth;

    this.renderer.setStyle(panel, 'width', `${triggerWidth}px`);
  }

  openPanel(): void {
    this.colorPicker.openPanel();
  }
}
