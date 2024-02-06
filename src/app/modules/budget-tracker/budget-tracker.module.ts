import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetTrackerRoutingModule } from './budget-tracker-routing.module';
import { BudgetTrackerComponent } from './budget-tracker.component';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { AuthCoreModule } from '@budget-tracker/auth';
import { NavigationBarModule } from '@budget-tracker/navigation-bar';
import { InitDataGuard } from './guards';

@NgModule({
  declarations: [BudgetTrackerComponent],
  imports: [CommonModule, BudgetTrackerRoutingModule, DesignSystemModule, AuthCoreModule, NavigationBarModule],
  providers: [InitDataGuard],
})
export class BudgetTrackerModule {}
