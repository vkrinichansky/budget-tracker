import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { InfoCardColorScheme, MenuAction } from '@budget-tracker/design-system';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { InfoCardValueModalService, RootValuesFacadeService } from '../../../services';

@Component({
  selector: 'app-savings-info-card',
  templateUrl: './savings-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SavingsInfoCardComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.infoCards.savings';

  readonly colorScheme = InfoCardColorScheme;

  savings$: Observable<number>;

  menuActions$: Observable<MenuAction[]>;

  constructor(
    private rootValuesFacade: RootValuesFacadeService,
    private translateService: TranslateService,
    private infoCardValueModalService: InfoCardValueModalService
  ) {}

  ngOnInit(): void {
    this.savings$ = this.rootValuesFacade.getSavingsValue();

    this.menuActions$ = this.savings$.pipe(map((savings) => this.resolveMenuActions(savings)));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private resolveMenuActions(savings: number): MenuAction[] {
    return [
      {
        icon: 'plus',
        text: this.translateService.instant(this.buildTranslationKey('menu.increase')),
        action: () => this.infoCardValueModalService.openIncreaseSavingsModal(savings),
      },
      {
        icon: 'minus',
        text: this.translateService.instant(this.buildTranslationKey('menu.decrease')),
        disabled: savings === 0,
        action: () => this.infoCardValueModalService.openDecreaseSavingsModal(savings),
      },
      {
        icon: 'edit',
        text: this.translateService.instant(this.buildTranslationKey('menu.edit')),
        action: () => this.infoCardValueModalService.openEditSavingsModal(savings),
      },
    ];
  }
}
