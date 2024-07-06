import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from './directives';
import { NavigatorService } from './services';

@NgModule({
  imports: [CommonModule],
  declarations: [NgVarDirective],
  exports: [NgVarDirective],
  providers: [NavigatorService],
})
export class UtilsModule {}
