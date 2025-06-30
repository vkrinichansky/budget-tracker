import { createFeature, createReducer, on } from '@ngrx/store';
import { AuthActions } from '../actions';
import { AuthState } from '../state';

const authFeatureName = 'auth';

const initialState: AuthState = {
  user: null,
  loading: false,
  loaded: false,
};

export const authFeature = createFeature({
  name: authFeatureName,
  reducer: createReducer(
    initialState,

    on(AuthActions.login, (state) => ({
      ...state,
      loading: true,
    })),

    on(AuthActions.loginFailed, (state) => ({
      ...state,
      loading: false,
    })),

    on(AuthActions.authenticated, (state, action) => ({
      ...state,
      user: action.user,
      loading: false,
      loaded: true,
    })),

    on(AuthActions.notAuthenticated, () => initialState)
  ),
});
