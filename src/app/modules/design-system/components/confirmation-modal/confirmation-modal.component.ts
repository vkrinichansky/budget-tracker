import { ChangeDetectionStrategy, Component, Inject, OnInit, model } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationModalData, ConfirmationModalTranslationData } from '../../models';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ConfirmationModalComponent implements OnInit {
  readonly checkmarkChecked = model(false);
  readonly loading$ = new BehaviorSubject<boolean>(false);

  get translation(): ConfirmationModalTranslationData {
    return this.data.translation;
  }

  get shouldDisplayCheckbox(): boolean {
    return this.data.shouldConsiderCheckbox && !!this.translation.checkboxTranslationKey;
  }

  get shouldDisplayRemark(): boolean {
    return !!this.translation.remarkTranslationKey;
  }

  get data(): ConfirmationModalData {
    return this._data;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) private _data: ConfirmationModalData,
    private dialogRef: MatDialogRef<ConfirmationModalComponent>
  ) {}

  ngOnInit(): void {
    navigator.vibrate(100);
  }

  buildTranslationKey(key: string): string {
    return `confirmationModal.${key}`;
  }

  async resolveAction(): Promise<void> {
    this.loading$.next(true);

    this.data.shouldConsiderCheckbox
      ? await this.data.action(this.checkmarkChecked())
      : await this.data.action();

    this.loading$.next(true);

    this.closeClick();
  }

  closeClick(): void {
    this.dialogRef.close();
  }
}
