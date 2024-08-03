import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CategoriesFacadeService } from '@budget-tracker/data';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-current-month-balance-info-card',
  templateUrl: './current-month-balance-info-card.component.html',
  styleUrl: './current-month-balance-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentMonthBalanceInfoCardComponent implements OnInit {
  currentMonthBalance$: Observable<number>;

  colorClasses$: Observable<Record<string, string>>;

  constructor(private categoriesFacade: CategoriesFacadeService) {}

  ngOnInit(): void {
    this.initListeners();
  }

  private initListeners(): void {
    this.currentMonthBalance$ = this.categoriesFacade.getCurrentMonthBalance();

    this.colorClasses$ = this.currentMonthBalance$.pipe(
      map((balance) => {
        if (balance === 0) {
          return {
            text: 'text-charcoal',
            bg: 'bg-white',
          };
        }

        if (balance > 0) {
          return {
            text: 'text-white',
            bg: 'bg-green',
          };
        } else {
          return {
            text: 'text-white',
            bg: 'bg-red',
          };
        }
      })
    );
  }
}
