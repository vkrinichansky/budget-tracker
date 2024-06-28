import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BudgetType } from '@budget-tracker/data';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SnackbarHandlerService {
  private readonly rootTranslationKey = 'snackbars';
  constructor(
    private snackBar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  showGeneralErrorSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('errorSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('errorSnackbar.buttonText'))
    );
  }

  showErrorSnackbar(error: string): void {
    this.openSnackBarWithCloseDelay(
      error,
      this.translateService.instant(this.buildTranslationKey('errorSnackbar.buttonText'))
    );
  }

  showBalanceEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('balanceEditedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('balanceEditedSnackbar.buttonText'))
    );
  }

  showSavingsEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('savingsEditedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('savingsEditedSnackbar.buttonText'))
    );
  }

  showFreeMoneyEditedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('freeMoneyEditedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('freeMoneyEditedSnackbar.buttonText'))
    );
  }

  showCategoryAddedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('categoryAddedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('categoryAddedSnackbar.buttonText'))
    );
  }

  showCategoryRemovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('categoryRemovedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('categoryRemovedSnackbar.buttonText'))
    );
  }

  showActivityLogRecordRemovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('activityLogRecordRemoved.message')),
      this.translateService.instant(this.buildTranslationKey('activityLogRecordRemoved.buttonText'))
    );
  }

  showBulkActivityLogRecordsRemovedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('bulkActivityLogRecordsRemoved.recordsByTypesRemoved')),
      this.translateService.instant(this.buildTranslationKey('activityLogRecordRemoved.buttonText'))
    );
  }

  showCategoryValueChangedSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('categoryValueChangedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('categoryValueChangedSnackbar.buttonText'))
    );
  }

  showCategoriesResetSnackbar(budgetType: BudgetType): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey(`categoriesResetSnackbar.${budgetType}`)),
      this.translateService.instant(this.buildTranslationKey('categoriesResetSnackbar.buttonText'))
    );
  }

  showDataResetSnackbar(): void {
    this.openSnackBarWithCloseDelay(
      this.translateService.instant(this.buildTranslationKey('dataResetSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('dataResetSnackbar.buttonText'))
    );
  }

  private buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private openSnackBarWithCloseDelay(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }
}
