import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { MonthlyStatisticsComponent } from './components';
import { NgChartsModule } from 'ng2-charts';
import { MetadataModule } from '@budget-tracker/metadata';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducers, StatisticsInitEffects } from './store';
import {
  StatisticsFacadeService,
  StatisticsInitApiService,
  StatisticsInitFacadeService,
} from './services';
import { EffectsModule } from '@ngrx/effects';
import { NgxApexchartsModule } from 'ngx-apexcharts';

const routes: Routes = [
  {
    path: '',
    component: StatisticsComponent,
  },
];

@NgModule({
  declarations: [StatisticsComponent, MonthlyStatisticsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DesignSystemModule,
    TranslateModule,
    NgChartsModule,
    MetadataModule,
    NgxApexchartsModule,
    StoreModule.forFeature(featureKey, reducers),
    EffectsModule.forFeature([StatisticsInitEffects]),
  ],
  providers: [StatisticsFacadeService, StatisticsInitApiService, StatisticsInitFacadeService],
})
export class StatisticsModule {}
