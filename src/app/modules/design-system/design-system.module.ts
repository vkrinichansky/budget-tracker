import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  ConfirmationModalComponent,
  InfoCardComponent,
  LoaderComponent,
  PageHeaderComponent,
  SvgIconComponent,
  SvgIconWithBgComponent,
  InfoIconComponent,
  MenuComponent,
} from './components';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalService } from './services';

@NgModule({
  declarations: [
    SvgIconComponent,
    ButtonComponent,
    LoaderComponent,
    PageHeaderComponent,
    InfoCardComponent,
    SvgIconWithBgComponent,
    MenuComponent,
    ConfirmationModalComponent,
    InfoIconComponent,
  ],
  imports: [CommonModule, MatMenuModule, MatTooltipModule, MatDialogModule, TranslateModule],
  exports: [
    SvgIconComponent,
    ButtonComponent,
    LoaderComponent,
    PageHeaderComponent,
    InfoCardComponent,
    SvgIconWithBgComponent,
    MenuComponent,
    InfoIconComponent,
  ],
  providers: [ConfirmationModalService],
})
export class DesignSystemModule {}
