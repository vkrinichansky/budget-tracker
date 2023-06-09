import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { BudgetTrackerFacadeService } from './services';

@Component({
  selector: 'app-budget-tracker',
  templateUrl: './budget-tracker.component.html',
  styleUrls: ['./budget-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTrackerComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private btFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.isLoading$ = this.btFacade.isDataLoading();
  }
}
