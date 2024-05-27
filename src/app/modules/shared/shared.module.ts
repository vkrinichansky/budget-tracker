import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostConnectionService, NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { CurrencySwitcherComponent, LostConnectionMessageComponent } from './components';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from './pipes';

@NgModule({
  declarations: [LanguageSwitcherComponent, CurrencySwitcherComponent, CurrencyPipe, LostConnectionMessageComponent],
  imports: [CommonModule, MatSnackBarModule, TranslateModule, DesignSystemModule, MatTooltipModule],
  exports: [LanguageSwitcherComponent, CurrencySwitcherComponent, CurrencyPipe, LostConnectionMessageComponent],
  providers: [NavigatorService, SnackbarHandlerService, CurrencyPipe, LostConnectionService],
})
export class SharedModule {}
