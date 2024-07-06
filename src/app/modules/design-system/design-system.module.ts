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
  IconPickerComponent,
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgxColorsModule } from 'ngx-colors';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

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
    MatFormFieldModule,
    NgxColorsModule,
    MatInputModule,
    MatSelectModule,
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
    ColorPickerComponent,
    IconPickerComponent,
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
    ColorPickerComponent,
    IconPickerComponent,
  ],
  providers: [ConfirmationModalService],
})
export class DesignSystemModule {}
