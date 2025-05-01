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
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MetadataModule } from '@budget-tracker/metadata';
import { NgxApexchartsModule } from 'ngx-apexcharts';
@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    UtilsModule,
    NgChartsModule,
    ScrollingModule,
    MetadataModule,
    NgxApexchartsModule,
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
