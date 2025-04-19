import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PreventInvalidCharsDirective } from './directives';
import { NavigatorService } from './services';
import { ClassToHexColorPipe, NumberSpacePipe } from './pipes';

@NgModule({
  imports: [CommonModule],
  declarations: [PreventInvalidCharsDirective, ClassToHexColorPipe, NumberSpacePipe],
  exports: [PreventInvalidCharsDirective, ClassToHexColorPipe, NumberSpacePipe],
  providers: [NavigatorService, ClassToHexColorPipe, NumberSpacePipe],
})
export class UtilsModule {}
