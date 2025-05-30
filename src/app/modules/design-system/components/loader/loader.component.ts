import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LoaderComponent {
  @Input()
  size: 'main-loader' | 'button-loader' = 'button-loader';

  @Input()
  colorMode: 'dark' | 'light' = 'light';

  @HostBinding('class')
  private get classes(): string {
    return `${this.size} ${this.colorMode}`;
  }
}
