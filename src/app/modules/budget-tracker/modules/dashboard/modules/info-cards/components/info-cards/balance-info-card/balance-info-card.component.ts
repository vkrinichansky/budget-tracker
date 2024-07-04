import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsFacadeService } from '@budget-tracker/data';

@Component({
  selector: 'app-balance-info-card',
  templateUrl: './balance-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceInfoCardComponent implements OnInit {
  fullBalance$: Observable<number>;

  constructor(private accountFacade: AccountsFacadeService) {}

  ngOnInit(): void {
    this.fullBalance$ = this.accountFacade.getFullBallance();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.fullBalance.${key}`;
  }
}
