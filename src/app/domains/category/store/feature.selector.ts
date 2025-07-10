import { createFeatureSelector } from '@ngrx/store';
import { CategoryState } from './category.reducer';

export const featureKey = 'category';

export const dataFeatureSelector = createFeatureSelector<CategoryState>(featureKey);
