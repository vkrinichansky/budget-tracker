import { ChangeDetectionStrategy, Component, Inject, OnInit, model } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConfirmationModalData, ConfirmationModalTranslationData } from '../../models';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmationModalComponent implements OnInit {
  readonly checkmarkChecked = model(false);

  get translation(): ConfirmationModalTranslationData {
    return this.data.translation;
  }

  get shouldDisplayCheckbox(): boolean {
    return this.data.shouldConsiderCheckbox && !!this.translation.checkboxTranslationKey;
  }

  get shouldDisplayRemark(): boolean {
    return !!this.translation.remarkTranslationKey;
  }

  constructor(
    private dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmationModalData
  ) {}

  ngOnInit(): void {
    navigator.vibrate(100);
  }

  buildTranslationKey(key: string): string {
    return `confirmationModal.${key}`;
  }

  closeClick(): void {
    this.dialogRef.close();
  }
}
