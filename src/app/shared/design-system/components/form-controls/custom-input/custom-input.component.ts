import { ChangeDetectionStrategy, Component, forwardRef, HostBinding, Input } from '@angular/core';
import { NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
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
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true,
    },
  ],
  standalone: false,
})
export class CustomInputComponent extends GenericCustomControlComponent {
  @HostBinding('class')
  private readonly classes = 'group';

  @Input()
  type: 'text' | 'number' = 'text';

  @Input()
  prefix: string;
}
