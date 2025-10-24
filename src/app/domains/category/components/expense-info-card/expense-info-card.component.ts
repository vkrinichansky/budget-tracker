import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryFacadeService } from '../../services';

@Component({
  selector: 'app-expense-info-card',
  templateUrl: './expense-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ExpenseInfoCardComponent implements OnInit {
  expense$: Observable<number>;

  constructor(private categoryFacade: CategoryFacadeService) {}

  ngOnInit(): void {
    this.expense$ = this.categoryFacade.getExpenseValue();
  }
}
