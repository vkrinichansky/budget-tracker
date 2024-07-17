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
  ColorPickerComponent,
  CustomSelectComponent,
  CustomInputComponent,
  ControlLabelComponent,
  ControlErrorComponent,
  CustomTextareaComponent,
  CharCounterComponent,
  ButtonToggleComponent,
  CheckboxComponent,
} from './components';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalService } from './services';
import { UtilsModule } from '@budget-tracker/utils';
import { TooltipRendererDirective } from './directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    CommonModule,
    MatMenuModule,
    MatDialogModule,
    TranslateModule,
    UtilsModule,
    ReactiveFormsModule,
    FormsModule,
    NgxColorsModule,
    OverlayModule,
    PortalModule,
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
    CustomSelectComponent,
    CustomInputComponent,
    ControlErrorComponent,
    ControlLabelComponent,
    ColorPickerComponent,
    CustomTextareaComponent,
    CharCounterComponent,
    ButtonToggleComponent,
    CheckboxComponent,
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
    CustomSelectComponent,
    CustomInputComponent,
    ControlErrorComponent,
    ControlLabelComponent,
    ColorPickerComponent,
    CustomTextareaComponent,
    CharCounterComponent,
    ButtonToggleComponent,
    CheckboxComponent,
  ],
  providers: [ConfirmationModalService],
})
export class DesignSystemModule {}
