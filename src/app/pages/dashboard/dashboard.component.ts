import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { BudgetType } from '@budget-tracker/shared-models';
import { BehaviorSubject, combineLatest, filter, firstValueFrom, map } from 'rxjs';
import { ActivityLogFacadeService } from '@budget-tracker/activity-log';
import { AccountFacadeService } from '@budget-tracker/account';
import { CategoryFacadeService } from '@budget-tracker/category';
import { MetadataFacadeService } from '@budget-tracker/metadata';
import { CurrencyChangeOrchestratorService } from '@budget-tracker/currency-change-orchestrator';
import { MoveMoneyBetweenAccountsOrchestratorService } from '@budget-tracker/move-money-between-accounts-orchestrator';
import { ResetCategoriesOrchestratorService } from '@budget-tracker/reset-categories-orchestrator';
import { ChangeCategoryValueOrchestratorService } from '@budget-tracker/change-category-value-orchestrator';
import { RemoveActivityLogRecordOrchestratorService } from '@budget-tracker/remove-activity-log-record-orchestrator';
import { EditAccountValueOrchestratorService } from '@budget-tracker/edit-account-value-orchestrator';
import { MonthResetOrchestratorService } from '@budget-tracker/month-reset-orchestrator';
import { SnackbarHandlerService } from '@budget-tracker/design-system';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly budgetType = BudgetType;

  loading$ = new BehaviorSubject<boolean>(true);

  constructor(
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly currencyChangeOrchestratorService: CurrencyChangeOrchestratorService,
    private readonly moveMoneyBetweenAccountsOrchestratorService: MoveMoneyBetweenAccountsOrchestratorService,
    private readonly resetCategoriesOrchestratorService: ResetCategoriesOrchestratorService,
    private readonly changeCategoryValueOrchestratorService: ChangeCategoryValueOrchestratorService,
    private readonly removeActivityLogRecordOrchestratorService: RemoveActivityLogRecordOrchestratorService,
    private readonly editAccountValueOrchestratorService: EditAccountValueOrchestratorService,
    private readonly monthResetOrchestratorService: MonthResetOrchestratorService,
    private readonly snackbarHandlerService: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initData();
    this.initDataLoading();
    this.initOrchestrators();
  }

  ngOnDestroy(): void {
    this.destroyOrchestrators();
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
      if (await this.monthResetOrchestratorService.doResetIfNeeded()) {
        this.snackbarHandlerService.showMessageSnackbar('messages.monthSnapshotCreated');
      }
    } catch (error) {
      this.snackbarHandlerService.showErrorSnackbar('errors.monthResetFlowFailed');
    } finally {
      this.loading$.next(false);
    }
  }

  private initOrchestrators(): void {
    this.currencyChangeOrchestratorService.listen();
    this.moveMoneyBetweenAccountsOrchestratorService.listen();
    this.resetCategoriesOrchestratorService.listen();
    this.changeCategoryValueOrchestratorService.listen();
    this.removeActivityLogRecordOrchestratorService.listen();
    this.editAccountValueOrchestratorService.listen();
  }

  private destroyOrchestrators(): void {
    this.currencyChangeOrchestratorService.destroy();
    this.moveMoneyBetweenAccountsOrchestratorService.destroy();
    this.resetCategoriesOrchestratorService.destroy();
    this.changeCategoryValueOrchestratorService.destroy();
    this.removeActivityLogRecordOrchestratorService.destroy();
    this.editAccountValueOrchestratorService.destroy();
  }
}
