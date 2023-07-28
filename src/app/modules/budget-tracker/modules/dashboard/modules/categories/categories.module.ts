import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CategoriesComponent,
  AddCategoryModalComponent,
  CategoryItemComponent,
  CategoryValueModalComponent,
} from './components';
import { CategoriesFacadeService, CategoriesService, CategoryModalsService } from './services';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { UtilsModule } from '@budget-tracker/utils';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgChartsModule } from 'ng2-charts';
import { categoriesFeature } from './store/reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CategoriesEffects } from './store/effects';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [CategoriesComponent, AddCategoryModalComponent, CategoryItemComponent, CategoryValueModalComponent],
  imports: [
    CommonModule,
    DesignSystemModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    UtilsModule,
    MatTooltipModule,
    NgChartsModule,
    StoreModule.forFeature(categoriesFeature),
    EffectsModule.forFeature([CategoriesEffects]),
    ScrollingModule,
  ],
  providers: [CategoryModalsService, CategoriesFacadeService, CategoriesService],
  exports: [CategoriesComponent],
})
export class CategoriesModule {}
