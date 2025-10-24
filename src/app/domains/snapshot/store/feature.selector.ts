import { createFeatureSelector } from '@ngrx/store';
import { SnapshotState } from './snapshot.reducer';

export const featureKey = 'snapshot';

export const dataFeatureSelector = createFeatureSelector<SnapshotState>(featureKey);
