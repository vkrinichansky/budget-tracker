import { Component, ChangeDetectionStrategy } from '@angular/core';
import { BudgetType } from '@budget-tracker/data';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly rootTranslationKey = 'dashboard';

  readonly budgetType = BudgetType;

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
