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
import { UtilsModule } from '@budget-tracker/utils';
import { NgChartsModule } from 'ng2-charts';
import { DataModule } from '@budget-tracker/data';
import { ScrollingModule } from '@angular/cdk/scrolling';
@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    NgChartsModule,
    DataModule,
    ScrollingModule,
  ],
  declarations: [
    CategoriesComponent,
    AddCategoryModalComponent,
    CategoryItemComponent,
    CategoryValueModalComponent,
  ],
  providers: [CategoryModalsService],
  exports: [CategoriesComponent],
})
export class CategoriesModule {}
