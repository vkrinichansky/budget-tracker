import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BudgetType } from '@budget-tracker/models';
import { DashboardInitFacadeService } from './services';
import { map, Observable } from 'rxjs';
import { ActivityLogFacadeService } from '@budget-tracker/activity-log';

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
    private readonly activityLogFacade: ActivityLogFacadeService
  ) {}

  ngOnInit(): void {
    this.dashboardInitFacade.initData();

    this.activityLogFacade.loadActivityLog();

    this.loading$ = this.dashboardInitFacade.isDataLoaded().pipe(map((isLoaded) => !isLoaded));
  }
}
