import { User } from '../models';

export interface AuthState {
  user: User | null;
  loading: boolean;
  loaded: boolean;
}
