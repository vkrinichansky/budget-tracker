import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @HostBinding('class')
  private readonly classes = 'flex w-full bg-dirty-white justify-between items-center';

  @Input()
  title: string;
}
