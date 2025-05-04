import { ChangeDetectionStrategy, Component, HostBinding, Inject } from '@angular/core';
import { SnackbarData } from '../../models';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar',
  templateUrl: './snackbar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class SnackbarComponent {
  @HostBinding('class')
  private readonly classes =
    'flex items-center justify-between gap-x-4 rounded-md text-white bg-charcoal p-4';

  get data(): SnackbarData {
    return this._data;
  }
  constructor(@Inject(MAT_SNACK_BAR_DATA) private _data: SnackbarData) {}
}
