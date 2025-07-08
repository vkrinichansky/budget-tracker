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
import { featureKey, reducers, CategoriesEffects, DashboardInitEffects } from './store';
import {
  CategoriesFacadeService,
  CategoriesApiService,
  DashboardInitApiService,
  DashboardInitFacadeService,
} from './services';
import { ActivityLogDomainModule } from '@budget-tracker/activity-log';
import { AccountDomainModule } from '@budget-tracker/account';

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
    EffectsModule.forFeature([CategoriesEffects, DashboardInitEffects]),
    DesignSystemModule,
    TranslateModule,
    InfoCardsModule,
    CategoriesModule,
    UtilsModule,
    MetadataModule,
    ActivityLogDomainModule,
    AccountDomainModule,
  ],
  providers: [
    CategoriesFacadeService,
    CategoriesApiService,
    DashboardInitApiService,
    DashboardInitFacadeService,
  ],
})
export class DashboardModule {}
