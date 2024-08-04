import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostBinding,
  Input,
  TemplateRef,
} from '@angular/core';
import { MenuAction } from '../../models';
import { isMobileWidth } from '@budget-tracker/utils';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCardComponent {
  @HostBinding('class')
  private readonly classes =
    'flex py-4 px-5 rounded-lg h-28 justify-start items-center gap-x-5 relative';

  @Input()
  primaryText: string | number;

  @Input()
  secondaryText: string;

  @Input()
  tertiaryText: string;

  @Input()
  iconName: string;

  @Input()
  shouldDisableMenu: boolean;

  @Input()
  tooltip: TemplateRef<unknown> | string;

  @Input()
  menuActions: MenuAction[];

  @Input()
  menuLoading: boolean;

  get isMobile(): boolean {
    return isMobileWidth();
  }

  get bgColor(): string {
    return window.getComputedStyle(this.el.nativeElement).backgroundColor;
  }

  get textColor(): string {
    return window.getComputedStyle(this.el.nativeElement).color;
  }

  constructor(private el: ElementRef) {}
}
