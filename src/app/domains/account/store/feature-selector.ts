import { createFeatureSelector } from '@ngrx/store';
import { AccountState } from './account.reducer';

export const featureKey = 'account';

export const dataFeatureSelector = createFeatureSelector<AccountState>(featureKey);
