import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from './directives';
import { NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LostConnectionService } from './services';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  declarations: [NgVarDirective],
  exports: [NgVarDirective],
  providers: [NavigatorService, SnackbarHandlerService, LostConnectionService],
})
export class UtilsModule {}
