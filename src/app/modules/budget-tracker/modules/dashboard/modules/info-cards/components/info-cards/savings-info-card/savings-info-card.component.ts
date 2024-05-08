import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuAction } from '@budget-tracker/design-system';
import { firstValueFrom, map, Observable } from 'rxjs';
import { InfoCardValueModalService } from '../../../services';
import { RootValuesFacadeService } from '@budget-tracker/data';

@Component({
  selector: 'app-savings-info-card',
  templateUrl: './savings-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingsInfoCardComponent implements OnInit {
  savings$: Observable<number>;

  menuActions: MenuAction[];

  constructor(
    private rootValuesFacade: RootValuesFacadeService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.savings$ = this.rootValuesFacade.getSavingsValue().pipe();
    this.menuActions = this.resolveMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.savings.${key}`;
  }

  private resolveMenuActions(): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.increase'),
        action: async () => {
          const savings = await firstValueFrom(this.savings$);
          this.infoCardValueModalService.openIncreaseSavingsModal(savings);
        },
      },
      {
        icon: 'minus',
        translationKey: this.buildTranslationKey('menu.decrease'),
        disabledObs: this.savings$.pipe(map((savings) => savings === 0)),
        action: async () => {
          const savings = await firstValueFrom(this.savings$);
          this.infoCardValueModalService.openDecreaseSavingsModal(savings);
        },
      },
      {
        icon: 'edit',
        translationKey: this.buildTranslationKey('menu.edit'),
        action: async () => {
          const savings = await firstValueFrom(this.savings$);
          this.infoCardValueModalService.openEditSavingsModal(savings);
        },
      },
    ];
  }
}
