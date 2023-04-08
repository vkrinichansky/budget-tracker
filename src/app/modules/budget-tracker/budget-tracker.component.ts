import { Component, OnInit } from '@angular/core';
import { BudgetTrackerFacadeService } from './services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-budget-tracker',
  templateUrl: './budget-tracker.component.html',
  styleUrls: ['./budget-tracker.component.scss'],
})
export class BudgetTrackerComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private btFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.isLoading$ = this.btFacade.isDataLoading();
  }
}
