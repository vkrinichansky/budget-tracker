import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CategoriesFacadeService } from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-current-month-balance-info-card',
  templateUrl: './current-month-balance-info-card.component.html',
  styleUrl: './current-month-balance-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentMonthBalanceInfoCardComponent implements OnInit {
  currentMonthBalance$: Observable<number>;

  constructor(private categoriesFacade: CategoriesFacadeService) {}

  ngOnInit(): void {
    this.currentMonthBalance$ = this.categoriesFacade.getCurrentMonthBalance();
  }

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.currentMonthBalance.${key}`;
  }
}
