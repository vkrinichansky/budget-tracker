import { createSelector } from '@ngrx/store';
import { User } from '../models';
import { dataFeatureSelector } from './feature.selector';

const userSelector = createSelector(dataFeatureSelector, (state) => state.user as User);
const authLoadedSelector = createSelector(dataFeatureSelector, (state) => state.isLoaded);

export const AuthSelectors = {
  userSelector,
  authLoadedSelector,
};
