import { createAction, props } from '@ngrx/store';
import { User } from '../../models';

export const AuthActions = {
  login: createAction('[Auth] Login attempt'),

  loginFailed: createAction('[Auth] Login attempt failed'),

  initDatabaseOnFirstLogin: createAction(
    '[Auth] Init database on first login',
    props<{ user: User }>()
  ),

  getUser: createAction('[Auth] Get user'),

  authenticated: createAction(
    '[Auth] Authenticated',
    props<{ user: User; shouldRedirect?: boolean }>()
  ),

  notAuthenticated: createAction('[Auth] Not authenticated'),

  logout: createAction('[Auth] Logout'),
};
