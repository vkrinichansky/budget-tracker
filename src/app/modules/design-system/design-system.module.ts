import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, LoaderComponent, SvgIconComponent } from './components';

@NgModule({
  declarations: [SvgIconComponent, ButtonComponent, LoaderComponent],
  imports: [CommonModule],
  exports: [SvgIconComponent, ButtonComponent, LoaderComponent],
})
export class DesignSystemModule {}
