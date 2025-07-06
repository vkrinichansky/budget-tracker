import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { CategoriesModule, InfoCardsModule } from './modules';
import { DashboardComponent } from './dashboard.component';
import { UtilsModule } from '@budget-tracker/utils';
import { MetadataModule } from '@budget-tracker/metadata';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  featureKey,
  reducers,
  CategoriesEffects,
  AccountsEffects,
  DashboardInitEffects,
} from './store';
import {
  CategoriesFacadeService,
  CategoriesApiService,
  AccountsFacadeService,
  AccountsApiService,
  DashboardInitApiService,
  DashboardInitFacadeService,
} from './services';
import { ActivityLogModule } from '@budget-tracker/activity-log';

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
    EffectsModule.forFeature([CategoriesEffects, AccountsEffects, DashboardInitEffects]),
    DesignSystemModule,
    TranslateModule,
    InfoCardsModule,
    CategoriesModule,
    UtilsModule,
    MetadataModule,
    ActivityLogModule,
  ],
  providers: [
    CategoriesFacadeService,
    CategoriesApiService,
    AccountsFacadeService,
    AccountsApiService,
    DashboardInitApiService,
    DashboardInitFacadeService,
  ],
})
export class DashboardModule {}
