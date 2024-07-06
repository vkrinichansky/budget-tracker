import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LostConnectionService, NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { LostConnectionMessageComponent } from './components';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe } from './pipes';

@NgModule({
  declarations: [CurrencyPipe, LostConnectionMessageComponent],
  imports: [CommonModule, MatSnackBarModule, TranslateModule, DesignSystemModule, MatTooltipModule],
  exports: [CurrencyPipe, LostConnectionMessageComponent],
  providers: [NavigatorService, SnackbarHandlerService, CurrencyPipe, LostConnectionService],
})
export class SharedModule {}
