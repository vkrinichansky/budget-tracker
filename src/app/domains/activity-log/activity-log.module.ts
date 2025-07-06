import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivityLogComponent,
  CategoriesResetRecordComponent,
  CategoryValueChangeRecordComponent,
  CurrencyChangeRecordComponent,
  GenericActivityLogRecordComponent,
  MoveMoneyBetweenAccountsRecordComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsModule } from '@budget-tracker/utils';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MetadataModule } from '@budget-tracker/metadata';
import { StoreModule } from '@ngrx/store';
import { featureKey, activityLogReducer, ActivityLogEffects } from './store';
import { EffectsModule } from '@ngrx/effects';
import { ActivityLogFacadeService, ActivityLogApiService } from './services';

@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    UtilsModule,
    ScrollingModule,
    MetadataModule,
    StoreModule.forFeature(featureKey, activityLogReducer),
    EffectsModule.forFeature([ActivityLogEffects]),
  ],
  declarations: [
    ActivityLogComponent,
    GenericActivityLogRecordComponent,
    CategoryValueChangeRecordComponent,
    CategoriesResetRecordComponent,
    MoveMoneyBetweenAccountsRecordComponent,
    CurrencyChangeRecordComponent,
  ],

  exports: [ActivityLogComponent],
  providers: [ActivityLogFacadeService, ActivityLogApiService],
})
export class ActivityLogModule {}
