import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RootValuesFacadeService } from '@budget-tracker/data';
import { MenuAction } from '@budget-tracker/design-system';
import { firstValueFrom, map, Observable } from 'rxjs';
import { InfoCardValueModalService } from '../../../services';

@Component({
  selector: 'app-free-money-info-card',
  templateUrl: './free-money-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeMoneyInfoCardComponent implements OnInit {
  freeMoney$: Observable<number>;

  menuActions: MenuAction[];

  constructor(
    private rootValuesFacade: RootValuesFacadeService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.freeMoney$ = this.rootValuesFacade.getFreeMoneyValue();
    this.menuActions = this.resolveMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.freeMoney.${key}`;
  }

  private resolveMenuActions(): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.increase'),
        action: async () => {
          const freeMoney = await firstValueFrom(this.freeMoney$);
          this.infoCardValueModalService.openIncreaseFreeMoneyModal(freeMoney);
        },
      },
      {
        icon: 'minus',
        translationKey: this.buildTranslationKey('menu.decrease'),
        disabledObs: this.freeMoney$.pipe(map((freeMoney) => freeMoney === 0)),
        action: async () => {
          const freeMoney = await firstValueFrom(this.freeMoney$);
          this.infoCardValueModalService.openDecreaseFreeMoneyModal(freeMoney);
        },
      },
      {
        icon: 'edit',
        translationKey: this.buildTranslationKey('menu.edit'),
        action: async () => {
          const freeMoney = await firstValueFrom(this.freeMoney$);
          this.infoCardValueModalService.openEditFreeMoneyModal(freeMoney);
        },
      },
    ];
  }
}
