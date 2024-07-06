import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from './directives';
import { NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [CommonModule, MatSnackBarModule],
  declarations: [NgVarDirective],
  exports: [NgVarDirective],
  providers: [NavigatorService, SnackbarHandlerService],
})
export class UtilsModule {}
