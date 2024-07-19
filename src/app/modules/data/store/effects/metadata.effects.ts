import { Injectable } from '@angular/core';
import { SnackbarHandlerService } from '@budget-tracker/utils';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, catchError, tap, EMPTY, switchMap, combineLatest, map } from 'rxjs';
import { MetadataActions } from '../actions';
import { CategoriesService, MetadataService } from '../../services';
import { Store } from '@ngrx/store';
import { CategoriesSelectors } from '../selectors';

@Injectable()
export class MetadataEffects {
  constructor(
    private actions$: Actions,
    private snackbarHandler: SnackbarHandlerService,
    private metadataService: MetadataService,
    private categoriesService: CategoriesService,

    private store: Store
  ) {}

  changeCurrency$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MetadataActions.changeCurrency),
        switchMap((action) =>
          this.store.select(CategoriesSelectors.allCategoriesDictionarySelector).pipe(
            map((dictionary) => ({
              action,
              categoriesIds: Object.keys(dictionary),
            }))
          )
        ),
        switchMap(({ action, categoriesIds }) =>
          combineLatest([
            from(this.metadataService.changeCurrency(action.newCurrency)),
            from(this.categoriesService.resetCategoriesAndActivityLog(categoriesIds)),
          ]).pipe(
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
        switchMap((action) =>
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
