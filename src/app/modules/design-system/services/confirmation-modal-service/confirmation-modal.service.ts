import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalData } from '../../models';
import { ConfirmationModalComponent } from '../../components';

@Injectable()
export class ConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  openConfirmationModal(
    questionTranslationKey: string,
    translationParams: { [key: string]: string } = {},
    action: () => unknown
  ): void {
    const data: ConfirmationModalData = {
      questionTranslationKey,
      translationParams,
      action,
    };

    this.dialog.open(ConfirmationModalComponent, { data, disableClose: true });
  }
}
