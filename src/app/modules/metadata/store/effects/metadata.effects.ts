import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CurrencyFacadeService, LanguageFacadeService, MetadataApiService } from '../../services';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, from, map, of, switchMap, take, tap } from 'rxjs';
import { MetadataActions } from '../actions';
import { CurrencyExchangeRate, predefinedCurrenciesDictionary } from '@budget-tracker/models';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { Store } from '@ngrx/store';
import { AuthActions } from '@budget-tracker/auth';

@Injectable()
export class MetadataEffects {
  constructor(
    private actions$: Actions,
    private metadataApiService: MetadataApiService,
    private languageFacade: LanguageFacadeService,
    private currencyFacade: CurrencyFacadeService,
    private snackbarHandler: SnackbarHandlerService,
    private store: Store
  ) {}

  loadMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.loadMetadata),
      switchMap(() =>
        from(this.metadataApiService.initMetadata()).pipe(
          switchMap((metadata) =>
            this.metadataApiService
              .getCurrencyExchangeRate(metadata.currency)
              .pipe(take(1))
              .pipe(
                switchMap((currencyExchangeRate) =>
                  of({
                    ...metadata,
                    currencyExchangeRate: this.setCurrentExchangeRate(
                      currencyExchangeRate[metadata.currency] as CurrencyExchangeRate
                    ),
                  })
                )
              )
          )
        )
      ),
      tap((metadata) => {
        this.currencyFacade.setCurrentCurrency(metadata.currency);
        this.currencyFacade.setCurrentExchangeRate(metadata.currencyExchangeRate);
        this.languageFacade.setCurrentLanguage(metadata.language);
      }),
      map((metadata) =>
        MetadataActions.metadataLoaded({
          currency: metadata.currency,
          language: metadata.language,
          currencyExchangeRate: metadata.currencyExchangeRate,
        })
      )
    )
  );

  private setCurrentExchangeRate(exchangeRate: CurrencyExchangeRate): CurrencyExchangeRate {
    const result: CurrencyExchangeRate = {};

    Object.keys(predefinedCurrenciesDictionary).forEach((currency) => {
      result[currency] = exchangeRate[currency];
    });

    return result;
  }

  changeCurrency$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MetadataActions.changeCurrency),
        switchMap((action) =>
          from(this.metadataApiService.changeCurrency(action.newCurrency)).pipe(
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
          from(this.metadataApiService.changeLanguage(action.newLanguage)).pipe(
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

  cleanStateOnLogOut$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.logout),
      map(() => MetadataActions.cleanState())
    )
  );
}
