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
  GenericActivityLogRecordComponent,
  CustomTooltipComponent,
  CheckboxGroupComponent,
  FullsizeLoaderComponent,
  BaseModalComponent,
} from './components';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalService } from './services';
import { UtilsModule } from '@budget-tracker/utils';
import { TooltipRendererDirective } from './directives';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatTooltipModule,
    MatDialogModule,
    TranslateModule,
    UtilsModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    FormsModule,
  ],

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
    GenericActivityLogRecordComponent,
    CustomTooltipComponent,
    TooltipRendererDirective,
    CheckboxGroupComponent,
    FullsizeLoaderComponent,
    BaseModalComponent,
  ],
  exports: [
    SvgIconComponent,
    ButtonComponent,
    LoaderComponent,
    PageHeaderComponent,
    InfoCardComponent,
    SvgIconWithBgComponent,
    MenuComponent,
    InfoIconComponent,
    GenericActivityLogRecordComponent,
    TooltipRendererDirective,
    CheckboxGroupComponent,
    FullsizeLoaderComponent,
    BaseModalComponent,
  ],
  providers: [ConfirmationModalService],
})
export class DesignSystemModule {}
