import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarComponent } from '../../components';
import { SnackbarData, SnackbarType } from '../../models';

@Injectable()
export class SnackbarHandlerService {
  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  showMessageSnackbar(message: string): void {
    this.openSnackBarWithCloseDelay(this.translateService.instant(message), SnackbarType.Message);
  }

  showErrorSnackbar(error: string): void {
    this.openSnackBarWithCloseDelay(this.translateService.instant(error), SnackbarType.Error);
  }

  // TODO: don't forget to use this snackbar when you edit account value
  showAccountValueEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('messages.account.accountValueEdited'),
      SnackbarType.Message
    );
  }

  private openSnackBarWithCloseDelay(
    message: string,
    type: SnackbarType,
    buttonText: string = this.translateService.instant('messages.defaultOkButtonText'),
    buttonAction: () => unknown = () => this.snackBar.dismiss()
  ): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      verticalPosition: 'top',
      data: { message, buttonText, buttonAction, type } as SnackbarData,
    });
  }
}
