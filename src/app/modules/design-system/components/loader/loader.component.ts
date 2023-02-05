import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoaderComponent {
  @Input()
  widthClass = 'w-6';

  @Input()
  heightClass = 'h-6';

  @HostBinding('class')
  private get classes(): string {
    return `${this.widthClass} ${this.heightClass}`;
  }
}
