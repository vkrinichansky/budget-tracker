import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective, PreventInvalidCharsDirective } from './directives';
import { NavigatorService } from './services';
import { ClassToHexColorPipe } from './pipes';

@NgModule({
  imports: [CommonModule],
  declarations: [NgVarDirective, PreventInvalidCharsDirective, ClassToHexColorPipe],
  exports: [NgVarDirective, PreventInvalidCharsDirective, ClassToHexColorPipe],
  providers: [NavigatorService, ClassToHexColorPipe],
})
export class UtilsModule {}
