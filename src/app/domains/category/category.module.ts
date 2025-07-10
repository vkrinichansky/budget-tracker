import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoriesComponent,
  AddCategoryModalComponent,
  CategoryItemComponent,
  CategoryValueModalComponent,
  ExpenseInfoCardComponent,
  CurrentMonthBalanceInfoCardComponent,
  IncomeInfoCardComponent,
} from './components';
import {
  CategoryApiService,
  CategoryFacadeService,
  CategoryModalService,
  CategoryService,
} from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UtilsModule } from '@budget-tracker/utils';
import { NgChartsModule } from 'ng2-charts';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MetadataModule } from '@budget-tracker/metadata';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { featureKey } from './store/feature.selector';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects, categoryReducer } from './store';

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
    StoreModule.forFeature(featureKey, categoryReducer),
    EffectsModule.forFeature([CategoryEffects]),
  ],
  declarations: [
    CategoriesComponent,
    AddCategoryModalComponent,
    CategoryItemComponent,
    CategoryValueModalComponent,
    ExpenseInfoCardComponent,
    IncomeInfoCardComponent,
    CurrentMonthBalanceInfoCardComponent,
  ],
  exports: [
    CategoriesComponent,
    ExpenseInfoCardComponent,
    IncomeInfoCardComponent,
    CurrentMonthBalanceInfoCardComponent,
  ],
  providers: [CategoryModalService, CategoryApiService, CategoryFacadeService, CategoryService],
})
export class CategoryDomainModule {}
