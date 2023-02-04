import { Category } from './category.model';

export interface AppState {
  income: Category[];
  expense: Category[];
  balance: number;
  accumulation: number;
  free: number;
}
