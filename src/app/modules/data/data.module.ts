import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { CategoriesEffects, DataInitEffects, RootValuesEffects, featureKey, reducers } from './store';
import {
  ActivityLogFacadeService,
  CategoriesFacadeService,
  CategoriesService,
  DataInitFacadeService,
  DataInitService,
  RootValuesFacadeService,
  RootValuesService,
} from './services';
import { EffectsModule } from '@ngrx/effects';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature([RootValuesEffects, CategoriesEffects, DataInitEffects]),
  ],
  providers: [
    ActivityLogFacadeService,
    RootValuesService,
    RootValuesFacadeService,
    CategoriesFacadeService,
    CategoriesService,
    DataInitService,
    DataInitFacadeService,
  ],
})
export class DataModule {}
