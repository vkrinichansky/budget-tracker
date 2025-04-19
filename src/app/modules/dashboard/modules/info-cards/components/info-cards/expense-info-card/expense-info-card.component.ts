import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CategoriesFacadeService } from '../../../../../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-expense-info-card',
  templateUrl: './expense-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseInfoCardComponent implements OnInit {
  expense$: Observable<number>;

  constructor(private categoriesFacade: CategoriesFacadeService) {}

  ngOnInit(): void {
    this.expense$ = this.categoriesFacade.getExpenseValue();
  }
}
