import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  ActivityLogComponent,
  AddCategoryModalComponent,
  BalanceInfoCardComponent,
  CategoriesComponent,
  CategoryItemComponent,
  CategoryManagementRecordComponent,
  DashboardComponent,
  ExpenseInfoCardComponent,
  FreeMoneyInfoCardComponent,
  IncomeInfoCardComponent,
  InfoCardValueModalComponent,
  RootValueChangeRecordComponent,
  SavingsInfoCardComponent,
  CategoryValueModalComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryModalsService, InfoCardValueModalService } from './services';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UtilsModule } from '@budget-tracker/utils';
import { MatSelectModule } from '@angular/material/select';
import { CategoryValueChangeRecordComponent } from './components/activity-log/components/category-value-change-record/category-value-change-record.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    IncomeInfoCardComponent,
    ExpenseInfoCardComponent,
    BalanceInfoCardComponent,
    SavingsInfoCardComponent,
    FreeMoneyInfoCardComponent,
    InfoCardValueModalComponent,
    ActivityLogComponent,
    RootValueChangeRecordComponent,
    CategoriesComponent,
    AddCategoryModalComponent,
    CategoryManagementRecordComponent,
    CategoryItemComponent,
    CategoryValueModalComponent,
    CategoryValueChangeRecordComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DesignSystemModule,
    TranslateModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule,
    UtilsModule,
    MatSelectModule,
  ],
  providers: [InfoCardValueModalService, CategoryModalsService],
})
export class DashboardModule {}
