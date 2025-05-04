import { StatisticsSnapshot } from './statistics.model';

export interface Snapshots {
  snapshots: {
    [date: number]: StatisticsSnapshot;
  };
}
