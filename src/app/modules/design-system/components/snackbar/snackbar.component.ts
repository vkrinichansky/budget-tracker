import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { ColorScheme, SnackbarData, SnackbarType } from '../../models';
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
    let textColorClass: string;

    switch (this.data.type) {
      case SnackbarType.Message:
        bgClass = 'bg-charcoal';
        textColorClass = 'text-white';
        break;

      case SnackbarType.Error:
        bgClass = 'bg-dark-red';
        textColorClass = 'text-white';
        break;
    }

    return `flex items-center justify-between gap-x-4 rounded-md ${textColorClass} ${bgClass} p-4`;
  }

  get buttonColorScheme(): ColorScheme {
    switch (this.data.type) {
      case SnackbarType.Message:
        return 'green';

      case SnackbarType.Error:
        return 'white-red';
    }
  }

  get data(): SnackbarData {
    return this._data;
  }
  constructor(@Inject(MAT_SNACK_BAR_DATA) private _data: SnackbarData) {}
}
