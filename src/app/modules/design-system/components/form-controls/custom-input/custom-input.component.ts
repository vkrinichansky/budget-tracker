import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { GenericCustomControlComponent } from '../generic-custom-control/generic-custom-control.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'custom-input',
  templateUrl: './custom-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
})
export class CustomInputComponent extends GenericCustomControlComponent {
  @HostBinding('class')
  private readonly classes = 'group flex flex-col';

  @Input()
  type: 'text' | 'number' = 'text';
}