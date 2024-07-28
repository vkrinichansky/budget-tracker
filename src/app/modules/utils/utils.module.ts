import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective, PreventInvalidCharsDirective } from './directives';
import { NavigatorService } from './services';

@NgModule({
  imports: [CommonModule],
  declarations: [NgVarDirective, PreventInvalidCharsDirective],
  exports: [NgVarDirective, PreventInvalidCharsDirective],
  providers: [NavigatorService],
})
export class UtilsModule {}
