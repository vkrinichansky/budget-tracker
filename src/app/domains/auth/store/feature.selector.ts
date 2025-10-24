import { createFeatureSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const featureKey = 'auth';

export const dataFeatureSelector = createFeatureSelector<AuthState>(featureKey);
