import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { BudgetType } from '@budget-tracker/models';
import { combineLatest, map, Observable } from 'rxjs';
import { ActivityLogFacadeService } from '@budget-tracker/activity-log';
import { AccountFacadeService } from '@budget-tracker/account';
import { CategoryFacadeService } from '@budget-tracker/category';
import { MetadataFacadeService } from '@budget-tracker/metadata';
import { CurrencyChangeOrchestratorService } from '@budget-tracker/currency-change-orchestrator';
import { MoveMoneyBetweenAccountsOrchestratorService } from '@budget-tracker/move-money-between-accounts-orchestrator';
import { ResetCategoriesOrchestratorService } from '@budget-tracker/reset-categories-orchestrator';
import { ChangeCategoryValueOrchestratorService } from '@budget-tracker/change-category-value-orchestrator';
import { RemoveActivityLogRecordOrchestratorService } from '@budget-tracker/remove-activity-log-record-orchestrator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class DashboardComponent implements OnInit, OnDestroy {
  readonly budgetType = BudgetType;

  loading$: Observable<boolean>;

  constructor(
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly currencyChangeOrchestratorService: CurrencyChangeOrchestratorService,
    private readonly moveMoneyBetweenAccountsOrchestratorService: MoveMoneyBetweenAccountsOrchestratorService,
    private readonly resetCategoriesOrchestratorService: ResetCategoriesOrchestratorService,
    private readonly changeCategoryValueOrchestratorService: ChangeCategoryValueOrchestratorService,
    private readonly removeActivityLogRecordOrchestratorService: RemoveActivityLogRecordOrchestratorService
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

  private initDataLoading(): void {
    this.loading$ = combineLatest([
      this.metadataFacade.metadataLoaded(),
      this.categoryFacade.categoriesLoaded(),
      this.accountFacade.accountsLoaded(),
      this.activityLogFacade.activityLogLoaded(),
    ]).pipe(
      map(
        ([metadataLoaded, accountsLoaded, categoriesLoaded, activityLogLoaded]) =>
          !metadataLoaded || !accountsLoaded || !categoriesLoaded || !activityLogLoaded
      )
    );
  }

  private initOrchestrators(): void {
    this.currencyChangeOrchestratorService.listen();
    this.moveMoneyBetweenAccountsOrchestratorService.listen();
    this.resetCategoriesOrchestratorService.listen();
    this.changeCategoryValueOrchestratorService.listen();
    this.removeActivityLogRecordOrchestratorService.listen();
  }

  private destroyOrchestrators(): void {
    this.currencyChangeOrchestratorService.destroy();
    this.moveMoneyBetweenAccountsOrchestratorService.destroy();
    this.resetCategoriesOrchestratorService.destroy();
    this.changeCategoryValueOrchestratorService.destroy();
    this.removeActivityLogRecordOrchestratorService.destroy();
  }
}
