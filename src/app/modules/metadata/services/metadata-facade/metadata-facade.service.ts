import { Injectable } from '@angular/core';
import { MetadataActions, MetadataSelectors } from '../../store';
import { Store } from '@ngrx/store';
import { CurrenciesEnum, LanguagesEnum } from '@budget-tracker/models';
import { filter, firstValueFrom, Observable } from 'rxjs';
import { AuthFacadeService } from '@budget-tracker/auth';

@Injectable()
export class MetadataFacadeService {
  constructor(
    private readonly store: Store,
    private readonly authFacade: AuthFacadeService
  ) {}

  async initMetadata(): Promise<void> {
    await firstValueFrom(this.authFacade.isLoggedIn().pipe(filter(Boolean)));
    this.store.dispatch(MetadataActions.loadMetadata());
  }

  isMetadataLoaded(): Observable<boolean> {
    return this.store.select(MetadataSelectors.metadataLoadedSelector);
  }

  changeCurrency(newCurrency: CurrenciesEnum): void {
    this.store.dispatch(MetadataActions.changeCurrency({ newCurrency }));
  }

  changeLanguage(newLanguage: LanguagesEnum): void {
    this.store.dispatch(MetadataActions.changeLanguage({ newLanguage }));
  }
}
