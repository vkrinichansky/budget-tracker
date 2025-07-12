import { Action, createReducer, on } from '@ngrx/store';
import { AuthActions } from './auth.actions';
import { User } from '../models';

export interface AuthState {
  user: User | null;
  isLoaded: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoaded: false,
};

export const adapterReducer = createReducer(
  initialState,

  on(
    AuthActions.authenticated,
    (state, action): AuthState => ({
      ...state,
      user: action.user,
      isLoaded: true,
    })
  ),

  on(AuthActions.notAuthenticated, (): AuthState => initialState)
);

export function authReducer(state = initialState, action: Action): AuthState {
  return adapterReducer(state, action);
}
