import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { ProgressBarSection } from '../../models';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  @HostBinding('class')
  private readonly classes =
    'flex items-center h-6 rounded-full border-2 border-solid border-charcoal overflow-hidden';

  @Input({ required: true })
  sections: ProgressBarSection[];
}
