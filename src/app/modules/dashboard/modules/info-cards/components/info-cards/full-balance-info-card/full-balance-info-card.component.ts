import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AccountsFacadeService } from '../../../../../services';

@Component({
  selector: 'app-full-balance-info-card',
  templateUrl: './full-balance-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class FullBalanceInfoCardComponent implements OnInit {
  fullBalance$: Observable<number>;

  constructor(private readonly accountsFacade: AccountsFacadeService) {}

  ngOnInit(): void {
    this.fullBalance$ = this.accountsFacade.getFullBallance();
  }
}
