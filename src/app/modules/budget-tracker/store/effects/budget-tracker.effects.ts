import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { AuthSelectors, AuthService } from '@budget-tracker/auth';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { filter, from, map, mergeMap, take } from 'rxjs';
import { BudgetTrackerService } from '../../services';
import { BudgetTrackerActions } from '../actions';

@Injectable()
export class BudgetTrackerEffects {
  constructor(private actions$: Actions, private budgetTrackerService: BudgetTrackerService, private store: Store) {}

  init$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BudgetTrackerActions.init),
      mergeMap(() =>
        this.store.select(AuthSelectors.userSelector).pipe(
          filter((user) => !!user),
          take(1)
        )
      ),
      mergeMap((user) => from(this.budgetTrackerService.initData(user?.uid as string))),
      map((data) => BudgetTrackerActions.dataLoaded({ data }))
    )
  );
}
