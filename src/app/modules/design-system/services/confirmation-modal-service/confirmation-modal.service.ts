import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalData, ConfirmationModalTranslationData } from '../../models';
import { ConfirmationModalComponent } from '../../components';

@Injectable()
export class ConfirmationModalService {
  constructor(private dialog: MatDialog) {}

  openConfirmationModal(
    translation: ConfirmationModalTranslationData,
    action: (() => unknown) | ((checkboxValue: boolean) => unknown),
    shouldConsiderCheckbox = false
  ): void {
    const data: ConfirmationModalData = {
      translation,
      action,
      shouldConsiderCheckbox,
    };

    this.dialog.open(ConfirmationModalComponent, {
      data,
      maxWidth: '400px',
      width: '400px',
      position: {},
    });
  }
}
