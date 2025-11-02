import { HostBinding } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ButtonType } from '../../models';

type ButtonSize = 'px28' | 'px32' | 'px36' | 'px100' | 'px160' | 'px240' | 'full' | 'auto';
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ButtonComponent {
  @HostBinding('class')
  private get classes(): string {
    return `flex overflow-hidden ${this.align} ${this.buttonSizeClasses} ${this.type} cursor-pointer`;
  }

  private get buttonSizeClasses(): string {
    return `${this.buttonSizeX}-x ${this.buttonSizeY}-y`;
  }

  @HostBinding('class.loading')
  @Input()
  loading: boolean;

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @HostBinding('class.rounded-md')
  @Input()
  rounded = true;

  @Input()
  buttonSizeX: ButtonSize = 'px32';

  @Input()
  buttonSizeY: ButtonSize = 'px32';

  @Input()
  type: ButtonType = 'primary';

  @Input()
  align: 'center' | 'start' = 'center';

  @Input()
  text = '';

  @Input()
  iconName: string;
}
