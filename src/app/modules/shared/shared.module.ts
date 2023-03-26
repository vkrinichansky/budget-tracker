import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigatorService, SnackbarHandlerService } from './services';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatSnackBarModule],
  providers: [NavigatorService, SnackbarHandlerService],
})
export class SharedModule {}
