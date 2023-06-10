import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeaderComponent {
  @HostBinding('class')
  private readonly classes = 'flex w-full py-6 bg-dirty-white justify-between items-center';

  @Input()
  title: string;
}
