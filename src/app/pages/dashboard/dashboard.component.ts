import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { BudgetType } from '@budget-tracker/shared-models';
import { BehaviorSubject, combineLatest, filter, firstValueFrom, map } from 'rxjs';
import { ActivityLogFacadeService } from '@budget-tracker/activity-log';
import { AccountFacadeService } from '@budget-tracker/account';
import { CategoryFacadeService } from '@budget-tracker/category';
import { MetadataFacadeService } from '@budget-tracker/metadata';
import { MonthResetOrchestratorService } from '@budget-tracker/month-reset-orchestrator';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { DashboardOrchestratorManagerService } from './dashboard-orchestrator-config/dashboard-orchestrator-manager.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly budgetType = BudgetType;
  readonly loading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly monthResetOrchestratorService: MonthResetOrchestratorService,
    private readonly snackbarHandlerService: SnackbarHandlerService,
    private readonly dashboardOrchestratorManagerService: DashboardOrchestratorManagerService
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initDataLoading();
    this.dashboardOrchestratorManagerService.init();
  }

  ngOnDestroy(): void {
    this.dashboardOrchestratorManagerService.destroyAll();
  }

  private initData(): void {
    this.metadataFacade.loadMetadata();
    this.accountFacade.loadAccounts();
    this.categoryFacade.loadCategories();
    this.activityLogFacade.loadActivityLog();
  }

  private async initDataLoading(): Promise<void> {
    this.loading$.next(true);

    await firstValueFrom(
      combineLatest([
        this.metadataFacade.metadataLoaded(),
        this.categoryFacade.categoriesLoaded(),
        this.accountFacade.accountsLoaded(),
        this.activityLogFacade.activityLogLoaded(),
      ]).pipe(
        map((flags) => flags.every((flag) => flag)),
        filter(Boolean)
      )
    );

    try {
      const result = await this.monthResetOrchestratorService.doResetIfNeeded();

      if (result) {
        this.snackbarHandlerService.showMessageSnackbar('messages.monthSnapshotCreated');
      }
    } catch (error) {
      this.snackbarHandlerService.showErrorSnackbar('errors.monthResetFlowFailed');
    } finally {
      this.loading$.next(false);
    }
  }
}
