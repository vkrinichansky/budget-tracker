import { Injectable } from '@angular/core';
import { ActivityLogGroupedByDays, ActivityLog, ActivityLogGroupedByDaysInObject } from '@budget-tracker/shared';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';
import { ActivityLogSelectors } from '../../store';

@Injectable()
export class ActivityLogFacadeService {
  constructor(private store: Store) {}

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDays[]> {
    return this.store.select(ActivityLogSelectors.activityLogSelector).pipe(
      map((activityLog) => this.groupActivityLogByDaysInObject(activityLog)),
      map((activityLogInObject) => this.activityLogByDaysInObjectToArray(activityLogInObject))
    );
  }

  private groupActivityLogByDaysInObject(activityLog: ActivityLog): ActivityLogGroupedByDaysInObject {
    return activityLog
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .reduce((group, record) => {
        const date = new Date(record.date);
        const dateKey = date.toLocaleDateString('en', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });

        group[dateKey] = group[dateKey] ?? [];
        group[dateKey].push(record);
        return group;
      }, {} as ActivityLogGroupedByDaysInObject);
  }

  private activityLogByDaysInObjectToArray(
    activityLogInObject: ActivityLogGroupedByDaysInObject
  ): ActivityLogGroupedByDays[] {
    return Object.keys(activityLogInObject).map(
      (key) =>
        ({
          date: key,
          records: activityLogInObject[key].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
        } as ActivityLogGroupedByDays)
    );
  }
}
