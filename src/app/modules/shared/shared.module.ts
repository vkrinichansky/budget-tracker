import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageService, NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { DesignSystemModule } from '@budget-tracker/design-system';

@NgModule({
  declarations: [LanguageSwitcherComponent],
  imports: [CommonModule, MatSnackBarModule, TranslateModule, DesignSystemModule],
  exports: [LanguageSwitcherComponent],
  providers: [NavigatorService, SnackbarHandlerService, LanguageService],
})
export class SharedModule {}
