import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ConfirmationModalService, MenuAction } from '@budget-tracker/design-system';
import { BudgetType } from '@budget-tracker/shared';
import { TranslateService } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { BudgetTrackerFacadeService } from '../../../../../services';

@Component({
  selector: 'app-income-info-card',
  templateUrl: './income-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.income';

  readonly menuActions: MenuAction[] = [
    {
      icon: 'eraser',
      text: this.translateService.instant(this.buildTranslationKey('menu.resetCategories')),
      action: () =>
        this.confirmationModalService.openConfirmationModal(
          this.buildTranslationKey('resetConfirmationMessage'),
          undefined,
          () => this.btFacade.resetCategoriesByType(BudgetType.Income)
        ),
    },
  ];

  income$: Observable<number>;
  shouldDisplayMenu$: Observable<boolean>;

  constructor(
    private budgetTrackerFacade: BudgetTrackerFacadeService,
    private translateService: TranslateService,
    private confirmationModalService: ConfirmationModalService,
    private btFacade: BudgetTrackerFacadeService
  ) {}

  ngOnInit(): void {
    this.income$ = this.budgetTrackerFacade.getIncomeValue();
    this.shouldDisplayMenu$ = this.budgetTrackerFacade.areIncomeCategoriesAllReset().pipe(map((areReset) => !areReset));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
