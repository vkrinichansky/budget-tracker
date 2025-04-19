import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CategoriesFacadeService } from '../../../../../services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-income-info-card',
  templateUrl: './income-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IncomeInfoCardComponent implements OnInit {
  income$: Observable<number>;

  constructor(private categoriesFacade: CategoriesFacadeService) {}

  ngOnInit(): void {
    this.income$ = this.categoriesFacade.getIncomeValue();
  }
}
