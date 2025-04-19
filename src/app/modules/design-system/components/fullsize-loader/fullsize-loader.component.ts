import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-fullsize-loader',
  templateUrl: './fullsize-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FullsizeLoaderComponent {
  @Input()
  size: 'main-loader' | 'button-loader' = 'main-loader';

  @Input()
  colorMode: 'dark' | 'light' = 'dark';

  @Input()
  placement: 'center' | 'start' = 'center';

  @HostBinding('class')
  private get classes(): string {
    return `w-full h-full flex justify-center z-50 bg-hover-black ${this.placementClasses}`;
  }

  private get placementClasses(): string {
    switch (this.placement) {
      case 'center':
        return 'items-center';

      case 'start':
        return 'items-start pt-12';
    }
  }
}
