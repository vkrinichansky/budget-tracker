import { createAction, props } from '@ngrx/store';
import { User } from '../models';

export const AuthActions = {
  login: createAction('[Auth] Login attempt'),

  setUser: createAction('[Auth] Get user'),

  authenticated: createAction('[Auth] Authenticated', props<{ user: User }>()),

  notAuthenticated: createAction('[Auth] Not authenticated'),

  logout: createAction('[Auth] Logout'),
};
