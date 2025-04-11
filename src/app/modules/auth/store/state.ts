import { User } from '@budget-tracker/models';

export interface AuthState {
  user: User | null;
  loading: boolean;
  loaded: boolean;
}
