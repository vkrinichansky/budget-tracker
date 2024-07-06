import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from './directives';
import { NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LostConnectionService } from './services';
import { CurrencyPipe } from './pipes';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  declarations: [NgVarDirective, CurrencyPipe],
  exports: [NgVarDirective, CurrencyPipe],
  providers: [NavigatorService, SnackbarHandlerService, LostConnectionService, CurrencyPipe],
})
export class UtilsModule {}
