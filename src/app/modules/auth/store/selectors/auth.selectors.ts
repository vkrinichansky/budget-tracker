import { createSelector } from '@ngrx/store';
import { User } from '../../models';
import { authFeature } from '../reducers';

const authStateSelector = createSelector(authFeature.selectAuthState, (authState) => authState);

const userSelector = createSelector(authFeature.selectUser, (user) => user as User);

const authLoadingSelector = createSelector(authFeature.selectLoading, (loading) => loading);

const authLoadedSelector = createSelector(authFeature.selectLoaded, (loaded) => loaded);

export const AuthSelectors = {
  authStateSelector,
  userSelector,
  authLoadingSelector,
  authLoadedSelector,
};
