import { createAction, props } from '@ngrx/store';
import { User } from '../../models';

enum AuthActionsType {
  GetUser = '[Auth] Get user',
  Authenticated = '[Auth] Authenticated',
  NotAuthenticated = '[Auth] Not Authenticated',
  Login = '[Auth] Login attempt',
  LoginFailed = '[Auth] Login attempt failed',
  InitDatabaseOnFirstLogin = '[Auth] Init database on first login',
  Logout = '[Auth] Logout',
}

export const AuthActions = {
  login: createAction(AuthActionsType.Login),
  loginFailed: createAction(AuthActionsType.LoginFailed),
  initDatabaseOnFirstLogin: createAction(AuthActionsType.InitDatabaseOnFirstLogin, props<{ user: User }>()),
  getUser: createAction(AuthActionsType.GetUser),
  authenticated: createAction(AuthActionsType.Authenticated, props<{ user: User, shouldRedirect?: boolean }>()),
  notAuthenticated: createAction(AuthActionsType.NotAuthenticated),
  logout: createAction(AuthActionsType.Logout),
};
