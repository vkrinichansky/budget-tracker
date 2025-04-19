import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { featureKey, reducers } from './store';
import { StatisticsFacadeService } from './services';

@NgModule({
  imports: [CommonModule, StoreModule.forFeature(featureKey, reducers)],
  providers: [StatisticsFacadeService],
})
export class DataModule {}
