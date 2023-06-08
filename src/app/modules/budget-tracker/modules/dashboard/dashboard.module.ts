import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import {
  ActivityLogComponent,
  AddCategoryModalComponent,
  CategoriesComponent,
  CategoryItemComponent,
  CategoryManagementRecordComponent,
  RootValueChangeRecordComponent,
  CategoryValueModalComponent,
  CategoryValueChangeRecordComponent,
  CategoriesResetRecordComponent,
} from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CategoryModalsService } from './services';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UtilsModule } from '@budget-tracker/utils';
import { MatSelectModule } from '@angular/material/select';
import { NgChartsModule } from 'ng2-charts';
import { InfoCardsModule } from './modules';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    ActivityLogComponent,
    RootValueChangeRecordComponent,
    CategoriesComponent,
    AddCategoryModalComponent,
    CategoryManagementRecordComponent,
    CategoryItemComponent,
    CategoryValueModalComponent,
    CategoryValueChangeRecordComponent,
    CategoriesResetRecordComponent,
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
    NgChartsModule,
    InfoCardsModule,
  ],
  providers: [CategoryModalsService],
})
export class DashboardModule {}
