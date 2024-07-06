import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoriesComponent,
  AddCategoryModalComponent,
  CategoryItemComponent,
  CategoryValueModalComponent,
} from './components';
import { CategoryModalsService } from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { UtilsModule } from '@budget-tracker/utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { DataModule } from '@budget-tracker/data';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    UtilsModule,
    MatTooltipModule,
    NgChartsModule,
    DataModule,
    ScrollingModule,
    MatButtonToggleModule,
    MatRadioModule,
  ],
  declarations: [CategoriesComponent, AddCategoryModalComponent, CategoryItemComponent, CategoryValueModalComponent],
  providers: [CategoryModalsService],
  exports: [CategoriesComponent],
})
export class CategoriesModule {}
