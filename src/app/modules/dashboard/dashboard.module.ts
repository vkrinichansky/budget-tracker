import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { ActivityLogModule, CategoriesModule, InfoCardsModule } from './modules';
import { DashboardComponent } from './dashboard.component';
import { CurrencySwitcherComponent, LanguageSwitcherComponent } from './components';
import { UtilsModule } from '@budget-tracker/utils';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
  },
];

@NgModule({
  declarations: [DashboardComponent, CurrencySwitcherComponent, LanguageSwitcherComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    DesignSystemModule,
    TranslateModule,
    InfoCardsModule,
    ActivityLogModule,
    CategoriesModule,
    UtilsModule,
  ],
})
export class DashboardModule {}
