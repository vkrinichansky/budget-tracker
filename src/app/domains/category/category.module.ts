import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoriesComponent,
  AddCategoryModalComponent,
  CategoryItemComponent,
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
import { UtilsModule } from '@budget-tracker/shared-utils';
import { NgChartsModule } from 'ng2-charts';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MetadataDomainModule } from '@budget-tracker/metadata';
import { NgxApexchartsModule } from 'ngx-apexcharts';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CategoryEffects, categoryReducer, featureKey } from './store';

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
    MetadataDomainModule,
    NgxApexchartsModule,
    StoreModule.forFeature(featureKey, categoryReducer),
    EffectsModule.forFeature([CategoryEffects]),
  ],
  declarations: [
    CategoriesComponent,
    AddCategoryModalComponent,
    CategoryItemComponent,
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
