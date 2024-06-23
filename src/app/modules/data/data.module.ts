import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import {
  ActivityLogEffects,
  CategoriesEffects,
  DataInitEffects,
  RootValuesEffects,
  featureKey,
  reducers,
} from './store';
import {
  ActivityLogFacadeService,
  ActivityLogService,
  CategoriesFacadeService,
  CategoriesService,
  DataInitFacadeService,
  DataInitService,
  RootValuesFacadeService,
  RootValuesService,
  StatisticsFacadeService,
} from './services';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature([RootValuesEffects, CategoriesEffects, DataInitEffects, ActivityLogEffects]),
  ],
  providers: [
    ActivityLogFacadeService,
    RootValuesService,
    RootValuesFacadeService,
    CategoriesFacadeService,
    CategoriesService,
    DataInitService,
    DataInitFacadeService,
    StatisticsFacadeService,
    ActivityLogService,
  ],
})
export class DataModule {}
