import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SnackbarHandlerService {
  private readonly rootTranslationKey = 'snackbars';
  constructor(private snackBar: MatSnackBar, private translateService: TranslateService) {}

  showGeneralErrorSnackbar(): void {
    this.snackBar.open(
      this.translateService.instant(this.buildTranslationKey('errorSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('errorSnackbar.buttonText'))
    );
  }

  showErrorSnackbar(error: string): void {
    this.snackBar.open(error, this.translateService.instant(this.buildTranslationKey('errorSnackbar.buttonText')));
  }

  showBalanceEditedSnackbar(): void {
    this.snackBar.open(
      this.translateService.instant(this.buildTranslationKey('balanceEditedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('balanceEditedSnackbar.buttonText'))
    );
  }

  showSavingsEditedSnackbar(): void {
    this.snackBar.open(
      this.translateService.instant(this.buildTranslationKey('savingsEditedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('savingsEditedSnackbar.buttonText'))
    );
  }

  showFreeMoneyEditedSnackbar(): void {
    this.snackBar.open(
      this.translateService.instant(this.buildTranslationKey('freeMoneyEditedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('freeMoneyEditedSnackbar.buttonText'))
    );
  }

  showCategoryAddedSnackbar(): void {
    this.snackBar.open(
      this.translateService.instant(this.buildTranslationKey('categoryAddedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('categoryAddedSnackbar.buttonText'))
    );
  }

  showCategoryRemovedSnackbar(): void {
    this.snackBar.open(
      this.translateService.instant(this.buildTranslationKey('categoryRemovedSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('categoryRemovedSnackbar.buttonText'))
    );
  }

  private buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
