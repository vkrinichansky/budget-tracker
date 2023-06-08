import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetTrackerRoutingModule } from './budget-tracker-routing.module';
import { BudgetTrackerComponent } from './budget-tracker.component';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { AuthCoreModule } from '@budget-tracker/auth';
import { NavigationBarModule } from '@budget-tracker/navigation-bar';
import { StoreModule } from '@ngrx/store';
import { budgetTrackerFeature } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { BudgetTrackerEffects } from './store/effects';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { InitDataGuard } from './guards';
import { BudgetTrackerFacadeService, BudgetTrackerService } from './services';

@NgModule({
  declarations: [BudgetTrackerComponent],
  imports: [
    CommonModule,
    BudgetTrackerRoutingModule,
    DesignSystemModule,
    AuthCoreModule,
    NavigationBarModule,
    StoreModule.forFeature(budgetTrackerFeature),
    EffectsModule.forFeature([BudgetTrackerEffects]),
    DashboardModule,
  ],
  providers: [InitDataGuard, BudgetTrackerService, BudgetTrackerFacadeService],
})
export class BudgetTrackerModule {}
