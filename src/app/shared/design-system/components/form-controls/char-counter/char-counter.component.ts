import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'char-counter',
  templateUrl: './char-counter.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CharCounterComponent {
  @HostBinding('class')
  private readonly classes = 'flex justify-end text-xs text-charcoal font-main font-bold';

  @Input()
  currentAmount: number;

  @Input()
  maxLength: number;
}
