import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CategoriesFacadeService } from '../../../../../services';
import { map, Observable } from 'rxjs';

interface ColorClasses {
  bg: string;
  text: string;
}

@Component({
  selector: 'app-current-month-balance-info-card',
  templateUrl: './current-month-balance-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class CurrentMonthBalanceInfoCardComponent implements OnInit {
  currentMonthBalance$: Observable<number>;

  colorClasses$: Observable<ColorClasses>;

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
            bg: 'bg-dark-green',
          };
        } else {
          return {
            text: 'text-white',
            bg: 'bg-dark-red',
          };
        }
      })
    );
  }
}
