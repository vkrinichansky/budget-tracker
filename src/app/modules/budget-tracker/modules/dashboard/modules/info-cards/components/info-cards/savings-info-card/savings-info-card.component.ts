import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MenuAction } from '@budget-tracker/design-system';
import { map, Observable } from 'rxjs';
import { InfoCardValueModalService } from '../../../services';
import { RootValuesFacadeService } from '@budget-tracker/data';

@Component({
  selector: 'app-savings-info-card',
  templateUrl: './savings-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingsInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.savings';

  savings$: Observable<number>;

  menuActions$: Observable<MenuAction[]>;

  constructor(
    private rootValuesFacade: RootValuesFacadeService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.savings$ = this.rootValuesFacade.getSavingsValue().pipe();

    this.menuActions$ = this.savings$.pipe(map((savings) => this.resolveMenuActions(savings)));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private resolveMenuActions(savings: number): MenuAction[] {
    return [
      {
        icon: 'plus',
        translationKey: this.buildTranslationKey('menu.increase'),
        action: () => this.infoCardValueModalService.openIncreaseSavingsModal(savings),
      },
      {
        icon: 'minus',
        translationKey: this.buildTranslationKey('menu.decrease'),
        disabled: savings === 0,
        action: () => this.infoCardValueModalService.openDecreaseSavingsModal(savings),
      },
      {
        icon: 'edit',
        translationKey: this.buildTranslationKey('menu.edit'),
        action: () => this.infoCardValueModalService.openEditSavingsModal(savings),
      },
    ];
  }
}
