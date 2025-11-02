import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { SnackbarData, SnackbarType } from '../../models';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SnackbarComponent {
  @HostBinding('class')
  private get classes(): string {
    let bgClass: string;

    switch (this.data.type) {
      case SnackbarType.MESSAGE:
        bgClass = 'bg-dark-green';
        break;

      case SnackbarType.ERROR:
        bgClass = 'bg-dark-red';
        break;
    }

    return `flex items-center justify-between gap-x-4 rounded-md p-4 text-white ${bgClass} border-2 border-charcoal border-solid`;
  }

  get data(): SnackbarData {
    return this._data;
  }
  constructor(@Inject(MAT_SNACK_BAR_DATA) private _data: SnackbarData) {}
}
