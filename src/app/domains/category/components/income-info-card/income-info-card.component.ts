import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoryFacadeService } from '../../services';

@Component({
  selector: 'app-income-info-card',
  templateUrl: './income-info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class IncomeInfoCardComponent implements OnInit {
  income$: Observable<number>;

  constructor(private categoryFacade: CategoryFacadeService) {}

  ngOnInit(): void {
    this.income$ = this.categoryFacade.getIncomeValue();
  }
}
