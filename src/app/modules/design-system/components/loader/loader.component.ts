import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

enum LoaderType {
  Button = 'button-loader',
  Main = 'main-loader',
}

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input()
  size: LoaderType = LoaderType.Button;

  @Input()
  colorMode: 'dark' | 'light' = 'light';

  @HostBinding('class')
  private get classes(): string {
    return `${this.size} ${this.colorMode}`;
  }
}
