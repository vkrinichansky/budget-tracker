import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RootValuesFacadeService } from '@budget-tracker/data';
import { MenuAction } from '@budget-tracker/design-system';
import { map, Observable } from 'rxjs';
import { InfoCardValueModalService } from '../../../services';

@Component({
  selector: 'app-free-money-info-card',
  templateUrl: './free-money-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FreeMoneyInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.freeMoney';

  freeMoney$: Observable<number>;

  menuActions$: Observable<MenuAction[]>;

  constructor(
    private rootValuesFacade: RootValuesFacadeService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.freeMoney$ = this.rootValuesFacade.getFreeMoneyValue();

    this.menuActions$ = this.freeMoney$.pipe(map((freeMoney) => this.resolveMenuActions(freeMoney)));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private resolveMenuActions(freeMoney: number): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.increase'),
        action: () => this.infoCardValueModalService.openIncreaseFreeMoneyModal(freeMoney),
      },
      {
        icon: 'minus',
        translationKey: this.buildTranslationKey('menu.decrease'),
        disabled: freeMoney === 0,
        action: () => this.infoCardValueModalService.openDecreaseFreeMoneyModal(freeMoney),
      },
      {
        icon: 'edit',
        translationKey: this.buildTranslationKey('menu.edit'),
        action: () => this.infoCardValueModalService.openEditFreeMoneyModal(freeMoney),
      },
    ];
  }
}
