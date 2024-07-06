import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { DataInitFacadeService } from '@budget-tracker/data';
import { LostConnectionService } from '@budget-tracker/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-budget-tracker',
  templateUrl: './budget-tracker.component.html',
  styleUrls: ['./budget-tracker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetTrackerComponent implements OnInit {
  isLoading$: Observable<boolean>;
  isOnline$: Observable<boolean>;

  constructor(
    private dataInitFacade: DataInitFacadeService,
    private lostConnectionService: LostConnectionService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.dataInitFacade.isDataLoading();
    this.isOnline$ = this.lostConnectionService.isOnline();
  }
}
