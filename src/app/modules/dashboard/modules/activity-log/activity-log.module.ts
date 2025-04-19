import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AccountValueEditRecordComponent,
  ActivityLogComponent,
  CategoriesResetRecordComponent,
  CategoryValueChangeRecordComponent,
  MoveMoneyBetweenAccountsRecordComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { UtilsModule } from '@budget-tracker/utils';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MetadataModule } from '@budget-tracker/metadata';

@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    UtilsModule,
    ScrollingModule,
    MetadataModule,
  ],
  declarations: [
    ActivityLogComponent,
    CategoryValueChangeRecordComponent,
    CategoriesResetRecordComponent,
    AccountValueEditRecordComponent,
    MoveMoneyBetweenAccountsRecordComponent,
  ],

  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
