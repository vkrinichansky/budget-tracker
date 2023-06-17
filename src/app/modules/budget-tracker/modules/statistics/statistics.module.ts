import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatisticsComponent } from './statistics.component';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { MonthlyStatisticsComponent } from './components';
import { NgChartsModule } from 'ng2-charts';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    MatTooltipModule,
  ],
})
export class StatisticsModule {}
