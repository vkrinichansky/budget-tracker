import { createFeatureSelector } from '@ngrx/store';
import { featureKey, DashboardFeatureState } from '../state';

export const dataFeatureSelector = createFeatureSelector<DashboardFeatureState>(featureKey);
