import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivityLogComponent,
  CategoriesResetRecordComponent,
  CategoryManagementRecordComponent,
  CategoryValueChangeRecordComponent,
  RootValueChangeRecordComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsModule } from '@budget-tracker/utils';
import { ActivityLogFacadeService } from './services';
import { StoreModule } from '@ngrx/store';
import { activityLogFeature } from './store/reducers';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    ActivityLogComponent,
    RootValueChangeRecordComponent,
    CategoryManagementRecordComponent,
    CategoryValueChangeRecordComponent,
    CategoriesResetRecordComponent,
  ],
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    UtilsModule,
    StoreModule.forFeature(activityLogFeature),
    ScrollingModule,
  ],
  exports: [ActivityLogComponent],
  providers: [ActivityLogFacadeService],
})
export class ActivityLogModule {}
