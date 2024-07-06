import { Injectable } from '@angular/core';
import { SnackbarHandlerService } from '@budget-tracker/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { mergeMap, from, catchError, tap, EMPTY } from 'rxjs';
import { MetadataActions } from '../actions';
import { MetadataService } from '../../services';
import { Store } from '@ngrx/store';

@Injectable()
export class MetadataEffects {
  constructor(
    private actions$: Actions,
    private snackbarHandler: SnackbarHandlerService,
    private metadataService: MetadataService,
    private store: Store
  ) {}

  changeCurrency$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MetadataActions.changeCurrency),
        mergeMap((action) =>
          from(this.metadataService.changeCurrency(action.newCurrency)).pipe(
            tap(() => location.reload()),
            catchError((error) => {
              this.snackbarHandler.showErrorSnackbar(error);
              this.store.dispatch(MetadataActions.changeCurrencyFail());

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  changeLanguage$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MetadataActions.changeLanguage),
        mergeMap((action) =>
          from(this.metadataService.changeLanguage(action.newLanguage)).pipe(
            tap(() => location.reload()),
            catchError((error) => {
              this.snackbarHandler.showErrorSnackbar(error);
              this.store.dispatch(MetadataActions.changeLanguageFail());

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );
}
