import { createFeatureSelector } from '@ngrx/store';
import { featureKey, MetadataFeatureState } from '../state';

export const metadataFeatureSelector = createFeatureSelector<MetadataFeatureState>(featureKey);
