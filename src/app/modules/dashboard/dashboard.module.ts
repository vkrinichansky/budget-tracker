import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityLogModule, CategoriesModule, InfoCardsModule } from './modules';
import { DashboardComponent } from './dashboard.component';
import { UtilsModule } from '@budget-tracker/utils';
import { MetadataModule } from '@budget-tracker/metadata';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  featureKey,
  reducers,
  CategoriesEffects,
  ActivityLogEffects,
  AccountsEffects,
  DashboardInitEffects,
} from './store';
import {
  ActivityLogFacadeService,
  CategoriesFacadeService,
  CategoriesApiService,
  ActivityLogApiService,
  AccountsFacadeService,
  AccountsApiService,
  DashboardInitApiService,
  DashboardInitFacadeService,
} from './services';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature([
      CategoriesEffects,
      ActivityLogEffects,
      AccountsEffects,
      DashboardInitEffects,
    ]),
    DesignSystemModule,
    TranslateModule,
    InfoCardsModule,
    ActivityLogModule,
    CategoriesModule,
    UtilsModule,
    MetadataModule,
  ],
  providers: [
    ActivityLogFacadeService,
    CategoriesFacadeService,
    CategoriesApiService,
    ActivityLogApiService,
    AccountsFacadeService,
    AccountsApiService,
    DashboardInitApiService,
    DashboardInitFacadeService,
  ],
})
export class DashboardModule {}
