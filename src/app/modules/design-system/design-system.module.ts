import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  InfoCardComponent,
  LoaderComponent,
  PageHeaderComponent,
  SvgIconComponent,
  SvgIconWithBgComponent,
} from './components';

@NgModule({
  declarations: [
    SvgIconComponent,
    ButtonComponent,
    LoaderComponent,
    PageHeaderComponent,
    InfoCardComponent,
    SvgIconWithBgComponent,
  ],
  imports: [CommonModule],
  exports: [
    SvgIconComponent,
    ButtonComponent,
    LoaderComponent,
    PageHeaderComponent,
    InfoCardComponent,
    SvgIconWithBgComponent,
  ],
})
export class DesignSystemModule {}
