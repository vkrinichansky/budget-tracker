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
  SnackbarComponent,
} from './components';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalService, SnackbarHandlerService } from './services';
import { isMobileWidth, UtilsModule } from '@budget-tracker/utils';
import { TooltipRendererDirective } from './directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';

@NgModule({
  imports: [
    CommonModule,
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
    SnackbarComponent,
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
  providers: [
    ConfirmationModalService,
    SnackbarHandlerService,
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        ...new MatDialogConfig(),
        width: '500px',
        maxWidth: isMobileWidth() ? '100%' : '500px',
        maxHeight: isMobileWidth() ? '100%' : '90vh',
        position: isMobileWidth() ? { bottom: '0' } : { top: '30px' },
        autoFocus: false,
      } as MatDialogConfig,
    },
  ],
})
export class DesignSystemModule {}
