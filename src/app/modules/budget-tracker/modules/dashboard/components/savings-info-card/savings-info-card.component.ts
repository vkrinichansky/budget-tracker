import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';
import { MenuAction } from '@budget-tracker/design-system';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { InfoCardValueModalService } from '../../services';

@Component({
  selector: 'app-savings-info-card',
  templateUrl: './savings-info-card.component.html',
})
export class SavingsInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.savings';

  savings$: Observable<number>;

  menuActions$: Observable<MenuAction[]>;

  constructor(
    private budgetTrackerFacade: BudgetTrackerFacadeService,
    private translateService: TranslateService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.savings$ = this.budgetTrackerFacade.getSavingsValue();

    this.menuActions$ = this.savings$.pipe(map((savings) => this.resolveMenuActions(savings)));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private resolveMenuActions(savings: number): MenuAction[] {
    return [
      {
        text: this.translateService.instant(this.buildTranslationKey('menu.increase')),
        action: () => this.infoCardValueModalService.openIncreaseSavingsModal(),
      },
      {
        text: this.translateService.instant(this.buildTranslationKey('menu.decrease')),
        action: () => this.infoCardValueModalService.openDecreaseSavingsModal(),
      },
      {
        text: this.translateService.instant(this.buildTranslationKey('menu.edit')),
        action: () => this.infoCardValueModalService.openEditSavingsModal(savings),
      },
    ];
  }
}
