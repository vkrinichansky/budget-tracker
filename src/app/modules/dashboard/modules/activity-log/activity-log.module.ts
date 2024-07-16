import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountManagementRecordComponent,
  AccountValueEditRecordComponent,
  ActivityLogComponent,
  ActivityLogRemoveMenuComponent,
  CategoriesResetRecordComponent,
  CategoryManagementRecordComponent,
  CategoryValueChangeRecordComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsModule } from '@budget-tracker/utils';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatMenuModule } from '@angular/material/menu';
import { DataModule } from '@budget-tracker/data';

@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    UtilsModule,
    ScrollingModule,
    MatMenuModule,
    DataModule,
  ],
  declarations: [
    ActivityLogComponent,
    CategoryManagementRecordComponent,
    CategoryValueChangeRecordComponent,
    CategoriesResetRecordComponent,
    AccountValueEditRecordComponent,
    ActivityLogRemoveMenuComponent,
    AccountManagementRecordComponent,
  ],

  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
