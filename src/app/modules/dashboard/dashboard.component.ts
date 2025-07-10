import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { BudgetType } from '@budget-tracker/models';
import { combineLatest, map, Observable } from 'rxjs';
import { ActivityLogFacadeService } from '@budget-tracker/activity-log';
import { AccountFacadeService } from '@budget-tracker/account';
import { CategoryFacadeService } from '@budget-tracker/category';

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
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly categoryFacade: CategoryFacadeService
  ) {}

  ngOnInit(): void {
    this.accountFacade.loadAccounts();
    this.categoryFacade.loadCategories();
    this.activityLogFacade.loadActivityLog();

    this.loading$ = combineLatest([
      this.categoryFacade.categoriesLoaded(),
      this.accountFacade.accountsLoaded(),
      this.activityLogFacade.activityLogLoaded(),
    ]).pipe(
      map(
        ([accountsLoaded, categoriesLoaded, activityLogLoaded]) =>
          !accountsLoaded || !categoriesLoaded || !activityLogLoaded
      )
    );
  }
}
