import { Component, HostBinding, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { BudgetTrackerFacadeService } from './services';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-budget-tracker',
  templateUrl: './budget-tracker.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTrackerComponent implements OnInit {
  @HostBinding('class')
  private readonly classes = 'flex h-full';

  isLoading$: Observable<boolean>;

  constructor(private btFacade: BudgetTrackerFacadeService) {}

  ngOnInit(): void {
    this.isLoading$ = this.btFacade.isDataLoading();
  }
}
