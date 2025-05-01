import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarComponent } from '../../components';
import { SnackbarData } from '../../models';
import { isMobileWidth } from '../../helpers';

@Injectable()
export class SnackbarHandlerService {
  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  showGeneralErrorSnackbar(): void {
    this.openSnackBarWithCloseDelay(this.translateService.instant('snackbars.errorSnackbar'));
  }

  showErrorSnackbar(error: string): void {
    this.openSnackBarWithCloseDelay(
      error,
      this.translateService.instant('snackbars.defaultOkButtonText')
    );
  }

  showBalanceEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.balanceEditedSnackbar')
    );
  }

  showSavingsEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.savingsEditedSnackbar')
    );
  }

  showFreeMoneyEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.freeMoneyEditedSnackbar')
    );
  }

  showCategoryAddedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.categoryAddedSnackbar')
    );
  }

  showCategoryRemovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.categoryRemovedSnackbar')
    );
  }

  showActivityLogRecordRemovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.activityLogRecordRemoved')
    );
  }

  showBulkActivityLogRecordsRemovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.bulkActivityLogRecordsRemoved')
    );
  }

  showCategoryValueChangedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.categoryValueChangedSnackbar')
    );
  }

  showCategoriesResetSnackbar(budgetType: string): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(`snackbars.categoriesResetSnackbar.${budgetType}`)
    );
  }

  showDataResetSnackbar(): void {
    this.openSnackBarWithCloseDelay(this.translateService.instant('snackbars.dataResetSnackbar'));
  }

  showAccountAddedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.accountAddedSnackbar')
    );
  }

  showAccountRemovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.accountRemovedSnackbar')
    );
  }

  showAccountValueEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(this.translateService.instant('snackbars.accountValueEdited'));
  }

  showAccountOrderChangedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.accountOrderChangedSnackbar')
    );
  }

  showMoneyBetweenAccountsMovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant('snackbars.moneyBetweenAccountsMoved')
    );
  }

  private openSnackBarWithCloseDelay(
    message: string,
    buttonText: string = this.translateService.instant('snackbars.defaultOkButtonText'),
    buttonAction: () => unknown = () => this.snackBar.dismiss()
  ): void {
    this.snackBar.openFromComponent(SnackbarComponent, {
      duration: 3000,
      verticalPosition: isMobileWidth() ? 'top' : 'bottom',
      data: { message, buttonText, buttonAction } as SnackbarData,
    });
  }
}
