import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

type LoaderSize = 'main-loader' | 'button-loader';
type LoaderColorMode = 'dark' | 'light' | 'inherit';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LoaderComponent {
  @Input()
  size: LoaderSize = 'button-loader';

  @Input()
  colorMode: LoaderColorMode = 'light';

  @HostBinding('class')
  private get classes(): string {
    return `${this.size} ${this.colorMode}`;
  }
}
