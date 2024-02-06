import { ElementRef, HostBinding, ViewChild } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ColorScheme } from '../../models';

type ButtonSize = 'small' | 'medium' | 'big' | 'large' | 'full' | 'auto';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @HostBinding('class.loading')
  @Input()
  loading: boolean;

  @HostBinding('class.disabled')
  @Input()
  disabled: boolean;

  @HostBinding('class')
  private get classes(): string {
    return `block rounded overflow-hidden ${this.buttonSize} ${this.colorScheme} ${this.align}`;
  }

  @Input()
  buttonSize: ButtonSize = 'small';

  @Input()
  text = '';

  @Input()
  iconName: string;

  @Input()
  colorScheme: ColorScheme = ColorScheme.TransparentDark;

  @Input()
  align: 'center' | 'start' = 'center';

  @ViewChild('textElement')
  textElement: ElementRef;

  isOverflowed = false;

  setIsOverflowed(): void {
    if (this.text) {
      this.isOverflowed = this.textElement.nativeElement.offsetWidth < this.textElement.nativeElement.scrollWidth;
    }
  }
}
