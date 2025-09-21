import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-fullsize-loader',
  templateUrl: './fullsize-loader.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FullsizeLoaderComponent extends LoaderComponent {
  @HostBinding('class')
  override get classes(): string {
    return `w-full h-full flex justify-center z-50 bg-hover-black items-center`;
  }
}
