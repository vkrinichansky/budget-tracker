import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, LoaderComponent, SvgIconComponent } from './components';
import { PageHeaderComponent } from './components/page-header/page-header.component';

@NgModule({
  declarations: [SvgIconComponent, ButtonComponent, LoaderComponent, PageHeaderComponent],
  imports: [CommonModule],
  exports: [SvgIconComponent, ButtonComponent, LoaderComponent, PageHeaderComponent],
})
export class DesignSystemModule {}
