import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountFacadeService } from '../../services';

@Component({
  selector: 'app-full-balance-info-card',
  templateUrl: './full-balance-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FullBalanceInfoCardComponent implements OnInit {
  fullBalance$: Observable<number>;

  constructor(private readonly accountFacade: AccountFacadeService) {}

  ngOnInit(): void {
    this.fullBalance$ = this.accountFacade.getFullBallance();
  }
}
