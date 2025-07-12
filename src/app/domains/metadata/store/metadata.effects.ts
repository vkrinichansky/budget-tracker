import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MetadataApiService, MetadataService } from '../services';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, from, map, of, switchMap, take, tap } from 'rxjs';
import { MetadataActions } from './metadata.actions';
import { AuthActions } from '@budget-tracker/auth';
import { CurrencyExchangeRate, predefinedCurrenciesDictionary, MetadataEvents } from '../models';
import { EventBusService } from '@budget-tracker/utils';

@Injectable()
export class MetadataEffects {
  constructor(
    private actions$: Actions,
    private metadataApiService: MetadataApiService,
    private metadataService: MetadataService,
    private eventBus: EventBusService
  ) {}

  initMetadataDB$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MetadataActions.initMetadataDB),
        switchMap(() =>
          from(this.metadataApiService.initMetadataDB()).pipe(
            tap(() =>
              this.eventBus.emit({
                type: MetadataEvents.INIT_METADATA_DB,
                status: 'success',
              })
            ),
            catchError(() => {
              this.eventBus.emit({
                type: MetadataEvents.INIT_METADATA_DB,
                status: 'error',
                errorCode: 'metadata.initMetadataDBFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
  );

  loadMetadata$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.loadMetadata),
      switchMap(() =>
        from(this.metadataApiService.loadMetadata()).pipe(
          switchMap((metadata) =>
            this.metadataApiService
              .getCurrencyExchangeRate(metadata.currency)
              .pipe(take(1))
              .pipe(
                switchMap((currencyExchangeRate) =>
                  of({
                    ...metadata,
                    currencyExchangeRate: this.getCurrentExchangeRate(
                      currencyExchangeRate[metadata.currency] as CurrencyExchangeRate
                    ),
                  })
                )
              )
          )
        )
      ),
      tap((metadata) => {
        this.metadataService.setMetadata(
          metadata.currency,
          metadata.currencyExchangeRate,
          metadata.language,
          metadata.resetDate
        );
      }),
      map(() => MetadataActions.metadataLoaded())
    )
  );

  changeCurrency$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.changeCurrency),
      switchMap((action) =>
        from(this.metadataApiService.changeCurrency(action.newCurrency)).pipe(
          switchMap(() =>
            of(
              MetadataActions.updateCategoriesAfterCurrencyChange({
                newCurrency: action.newCurrency,
              })
            )
          ),
          catchError(() => of(MetadataActions.changeCurrencyFail()))
        )
      )
    )
  );

  changeLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(MetadataActions.changeLanguage),
      switchMap((action) =>
        from(this.metadataApiService.changeLanguage(action.newLanguage)).pipe(
          switchMap(() => of(MetadataActions.changeLanguageSuccess())),
          catchError(() => of(MetadataActions.changeLanguageFail()))
        )
      )
    )
  );

  cleanStateOnLogOut$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => this.metadataService.clearMetadata())
      ),
    { dispatch: false }
  );

  private getCurrentExchangeRate(exchangeRate: CurrencyExchangeRate): CurrencyExchangeRate {
    const result: CurrencyExchangeRate = {};

    Object.keys(predefinedCurrenciesDictionary).forEach((currency) => {
      result[currency] = exchangeRate[currency];
    });

    return result;
  }
}
