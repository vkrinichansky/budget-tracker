import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class SnackbarHandlerService {
  private readonly rootTranslationKey = 'snackbars';
  constructor(private snackBar: MatSnackBar, private translateService: TranslateService) {}

  showErrorSnackbar(): void {
    this.snackBar.open(
      this.translateService.instant(this.buildTranslationKey('errorSnackbar.message')),
      this.translateService.instant(this.buildTranslationKey('errorSnackbar.buttonText'))
      // { duration: 10000 }
    );
  }

  private buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
