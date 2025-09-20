import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonComponent,
  ConfirmationModalComponent,
  InfoCardComponent,
  LoaderComponent,
  PageHeaderComponent,
  SvgIconComponent,
  InfoIconComponent,
  MenuComponent,
  CustomTooltipComponent,
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
  ProgressBarComponent,
} from './components';
import {
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatDialogConfig,
  MatDialogModule,
} from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmationModalService, SnackbarHandlerService } from './services';
import { isMobileWidth } from './helpers';
import { PreventInvalidCharsDirective, TooltipRendererDirective } from './directives';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxColorsModule } from 'ngx-colors';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ClassToHexColorPipe, NumberSpacePipe } from './pipes';

@NgModule({
  imports: [
    CommonModule,
    MatDialogModule,
    TranslateModule,
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
    MenuComponent,
    ConfirmationModalComponent,
    InfoIconComponent,
    CustomTooltipComponent,
    TooltipRendererDirective,
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
    PreventInvalidCharsDirective,
    ClassToHexColorPipe,
    NumberSpacePipe,
    ProgressBarComponent,
  ],
  exports: [
    SvgIconComponent,
    ButtonComponent,
    LoaderComponent,
    PageHeaderComponent,
    InfoCardComponent,
    MenuComponent,
    InfoIconComponent,
    TooltipRendererDirective,
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
    ClassToHexColorPipe,
    NumberSpacePipe,
    ProgressBarComponent,
  ],
  providers: [
    ConfirmationModalService,
    SnackbarHandlerService,
    ClassToHexColorPipe,
    NumberSpacePipe,
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
