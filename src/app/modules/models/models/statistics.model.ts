import { Category } from './category.model';

export interface StatisticsSnapshot {
  date: string;
  categories: Category[];
}

export interface Statistics {
  snapshots: {
    [date: number]: StatisticsSnapshot;
  };
}
