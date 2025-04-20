/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Actions, ofType } from '@ngrx/effects';
import { ActionCreator } from '@ngrx/store';
import {
  Observable,
  filter,
  first,
  timeout,
  firstValueFrom,
  mergeMap,
  throwError,
  race,
} from 'rxjs';

const TIMEOUT = 5_000;

@Injectable({
  providedIn: 'root',
})
export class ActionListenerService {
  constructor(private actions$: Actions) {}

  waitForAction<T extends { type: string }>(
    actionCreator: ActionCreator<string, (props: any) => T>,
    predicate?: (action: T) => boolean,
    msTimeout = TIMEOUT
  ): Observable<T> {
    let stream$ = this.actions$.pipe(
      ofType(actionCreator),
      filter((action): action is T => (predicate ? predicate(action as T) : true)),
      first()
    );

    if (msTimeout) {
      stream$ = stream$.pipe(timeout(msTimeout));
    }

    return stream$;
  }

  waitForResult<TSuccess extends { type: string }, TFailure extends { type: string }>(
    successAction: ActionCreator<string, (props: any) => TSuccess>,
    failureAction?: ActionCreator<string, (props: any) => TFailure>,
    predicateSuccess?: (action: TSuccess) => boolean,
    predicateFailure?: (action: TFailure) => boolean,
    msTimeout = TIMEOUT
  ): Promise<TSuccess> {
    const success$ = this.waitForAction<TSuccess>(successAction, predicateSuccess, msTimeout);

    if (!failureAction) {
      return firstValueFrom(success$);
    }

    const failure$ = this.waitForAction<TFailure>(failureAction, predicateFailure, msTimeout).pipe(
      mergeMap((action) => throwError(() => action))
    );

    return firstValueFrom(race([success$, failure$]));
  }
}
