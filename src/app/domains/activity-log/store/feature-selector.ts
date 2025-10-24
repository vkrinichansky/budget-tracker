import { createFeatureSelector } from '@ngrx/store';
import { ActivityLogState } from './activity-log.reducer';

export const featureKey = 'activityLog';

export const dataFeatureSelector = createFeatureSelector<ActivityLogState>(featureKey);
