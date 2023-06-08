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

@NgModule({
  declarations: [
    ActivityLogComponent,
    RootValueChangeRecordComponent,
    CategoryManagementRecordComponent,
    CategoryValueChangeRecordComponent,
    CategoriesResetRecordComponent,
  ],
  imports: [CommonModule, DesignSystemModule, TranslateModule, UtilsModule],
  exports: [ActivityLogComponent],
})
export class ActivityLogModule {}
