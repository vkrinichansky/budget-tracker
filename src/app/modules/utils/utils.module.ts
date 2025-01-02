import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective, PreventInvalidCharsDirective } from './directives';
import { NavigatorService } from './services';
import { ClassToHexColorPipe, NumberSpacePipe } from './pipes';

@NgModule({
  imports: [CommonModule],
  declarations: [
    NgVarDirective,
    PreventInvalidCharsDirective,
    ClassToHexColorPipe,
    NumberSpacePipe,
  ],
  exports: [NgVarDirective, PreventInvalidCharsDirective, ClassToHexColorPipe, NumberSpacePipe],
  providers: [NavigatorService, ClassToHexColorPipe, NumberSpacePipe],
})
export class UtilsModule {}
