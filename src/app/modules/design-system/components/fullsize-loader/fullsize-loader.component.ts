import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-fullsize-loader',
  templateUrl: './fullsize-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FullsizeLoaderComponent {
  @Input()
  size: 'main-loader' | 'button-loader' = 'main-loader';

  @Input()
  colorMode: 'dark' | 'light' = 'dark';

  @HostBinding('class')
  private get classes(): string {
    return 'w-full h-full flex justify-center items-center absolute top-0 left-0 z-50 bg-hover-black rounded-lg';
  }
}
