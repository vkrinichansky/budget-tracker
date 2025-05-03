import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-fullsize-loader',
  templateUrl: './fullsize-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FullsizeLoaderComponent {
  @HostBinding('class')
  private readonly classes = 'w-full h-full flex justify-center z-50 bg-hover-black items-center';

  @Input()
  size: 'main-loader' | 'button-loader' = 'main-loader';

  @Input()
  colorMode: 'dark' | 'light' = 'dark';
}
