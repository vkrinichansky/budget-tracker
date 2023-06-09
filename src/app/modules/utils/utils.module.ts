import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgVarDirective } from './directives';

@NgModule({
  imports: [CommonModule],
  declarations: [NgVarDirective],
  exports: [NgVarDirective],
})
export class UtilsModule {}
