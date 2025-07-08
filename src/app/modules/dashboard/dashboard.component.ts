import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BudgetType } from '@budget-tracker/models';
import { DashboardInitFacadeService } from './services';
import { map, Observable } from 'rxjs';
import { ActivityLogFacadeService } from '@budget-tracker/activity-log';
import { AccountsFacadeService } from '@budget-tracker/account';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardComponent implements OnInit {
  readonly budgetType = BudgetType;

  loading$: Observable<boolean>;

  constructor(
    private readonly dashboardInitFacade: DashboardInitFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly accountFacade: AccountsFacadeService
  ) {}

  ngOnInit(): void {
    this.dashboardInitFacade.initData();

    this.activityLogFacade.loadActivityLog();
    this.accountFacade.loadAccounts();

    this.loading$ = this.dashboardInitFacade.isDataLoaded().pipe(map((isLoaded) => !isLoaded));
  }
}
