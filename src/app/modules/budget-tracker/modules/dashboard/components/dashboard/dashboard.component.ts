import { Component } from '@angular/core';
import { BudgetType } from '@budget-tracker/shared';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  private readonly rootTranslationKey = 'dashboard';

  readonly budgetType = BudgetType;

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
