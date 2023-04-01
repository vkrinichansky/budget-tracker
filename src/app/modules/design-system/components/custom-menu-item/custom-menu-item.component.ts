import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { MatMenuItem } from '@angular/material/menu';
import { ButtonSize } from '../../models';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'custom-menu-item',
  templateUrl: './custom-menu-item.component.html',
  styleUrls: ['./custom-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomMenuItemComponent extends MatMenuItem {
  @HostBinding('class.disabled')
  private get isDisabled(): boolean {
    return this.disabled;
  }

  @HostBinding('class')
  private get classes(): string {
    return `block rounded overflow-hidden ${this.buttonSize}`;
  }

  @Input()
  buttonSize: ButtonSize = ButtonSize.Small;

  @Input()
  text = '';

  @Input()
  iconName: string;
}
