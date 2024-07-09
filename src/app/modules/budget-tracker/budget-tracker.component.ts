import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataInitFacadeService } from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-budget-tracker',
  templateUrl: './budget-tracker.component.html',
  styleUrls: ['./budget-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTrackerComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(private dataInitFacade: DataInitFacadeService) {}

  ngOnInit(): void {
    this.isLoading$ = this.dataInitFacade.isDataLoading();
  }
}
