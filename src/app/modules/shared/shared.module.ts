import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { CurrencySwitcherComponent } from './components';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [LanguageSwitcherComponent, CurrencySwitcherComponent],
  imports: [CommonModule, MatSnackBarModule, TranslateModule, DesignSystemModule, MatTooltipModule],
  exports: [LanguageSwitcherComponent, CurrencySwitcherComponent],
  providers: [NavigatorService, SnackbarHandlerService],
})
export class SharedModule {}
