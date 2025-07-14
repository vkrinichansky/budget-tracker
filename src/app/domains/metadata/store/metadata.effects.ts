import { Actions, createEffect, ofType } from '@ngrx/effects';
import { MetadataApiService, MetadataService } from '../services';
import { Injectable } from '@angular/core';
import { catchError, EMPTY, from, map, of, switchMap, take, tap, timeout } from 'rxjs';
import { MetadataActions } from './metadata.actions';
import { AuthActions } from '@budget-tracker/auth';
import { CurrencyExchangeRate, predefinedCurrenciesDictionary, MetadataEvents } from '../models';
import { EventBusService } from '@budget-tracker/utils';

const REQUEST_TIMEOUT = 5_000;

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
            timeout(REQUEST_TIMEOUT),
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
          timeout(REQUEST_TIMEOUT),
          switchMap((metadata) =>
            this.metadataApiService
              .getCurrencyExchangeRate(metadata.currency)
              .pipe(take(1), timeout(REQUEST_TIMEOUT))
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

  changeCurrency$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(MetadataActions.changeCurrency),
        switchMap((action) =>
          from(this.metadataApiService.changeCurrency(action.newCurrency)).pipe(
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.eventBus.emit({
                type: MetadataEvents.CURRENCY_CHANGE,
                status: 'success',
              });
            }),
            catchError(() => {
              this.eventBus.emit({
                type: MetadataEvents.CURRENCY_CHANGE,
                status: 'error',
                errorCode: 'metadata.changeCurrencyFailed',
              });

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
            timeout(REQUEST_TIMEOUT),
            tap(() => {
              this.eventBus.emit({
                type: MetadataEvents.CHANGE_LANGUAGE,
                status: 'success',
              });
            }),
            catchError(() => {
              this.eventBus.emit({
                type: MetadataEvents.CHANGE_LANGUAGE,
                status: 'error',
                errorCode: 'metadata.changeLanguageFailed',
              });

              return EMPTY;
            })
          )
        )
      ),
    { dispatch: false }
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
