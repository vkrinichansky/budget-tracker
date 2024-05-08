import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { firstValueFrom, map, Observable } from 'rxjs';
import { MenuAction } from '@budget-tracker/design-system';
import { InfoCardValueModalService } from '../../../services';
import { RootValuesFacadeService } from '@budget-tracker/data';

@Component({
  selector: 'app-balance-info-card',
  templateUrl: './balance-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceInfoCardComponent implements OnInit {
  fullBalance$: Observable<number>;

  currentBalance$: Observable<number>;

  menuActions: MenuAction[];

  constructor(
    private rootValuesFacade: RootValuesFacadeService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.fullBalance$ = this.rootValuesFacade.getFullBalanceValue();
    this.currentBalance$ = this.rootValuesFacade.getCurrentBalanceValue();
    this.menuActions = this.resolveMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.balance.${key}`;
  }

  private resolveMenuActions(): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.increase'),
        action: async () => {
          const fullBalance = await firstValueFrom(this.fullBalance$);
          this.infoCardValueModalService.openIncreaseBalanceModal(fullBalance);
        },
      },
      {
        icon: 'minus',
        translationKey: this.buildTranslationKey('menu.decrease'),
        disabledObs: this.fullBalance$.pipe(map((fullBalance) => fullBalance <= 0)),
        action: async () => {
          const fullBalance = await firstValueFrom(this.fullBalance$);
          this.infoCardValueModalService.openDecreaseBalanceModal(fullBalance);
        },
      },
      {
        icon: 'edit',
        translationKey: this.buildTranslationKey('menu.edit'),
        action: async () => {
          const fullBalance = await firstValueFrom(this.fullBalance$);
          this.infoCardValueModalService.openEditBalanceModal(fullBalance);
        },
      },
    ];
  }
}
