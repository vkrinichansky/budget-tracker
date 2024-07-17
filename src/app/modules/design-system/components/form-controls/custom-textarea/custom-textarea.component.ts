import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, Input } from '@angular/core';
import { GenericCustomControlComponent } from '../generic-custom-control/generic-custom-control.component';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'custom-textarea',
  templateUrl: './custom-textarea.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomTextareaComponent),
      multi: true,
    },
  ],
})
export class CustomTextareaComponent extends GenericCustomControlComponent {
  @HostBinding('class')
  private readonly classes = 'group flex flex-col';

  @Input()
  rows = 3;
}
