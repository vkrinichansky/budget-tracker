import { Injectable } from '@angular/core';
import { Subject, firstValueFrom, filter, Observable } from 'rxjs';

type DomainEventStatus = 'success' | 'error' | 'event';

export interface DomainEvent<T = unknown> {
  type: string;
  status: DomainEventStatus;
  payload?: T;
  errorCode?: string;
}

@Injectable({ providedIn: 'root' })
export class EventBusService {
  private readonly event$ = new Subject<DomainEvent>();

  emit<T>(event: DomainEvent<T>): void {
    this.event$.next(event);
  }

  on<T>(type: string): Observable<DomainEvent<T>> {
    return this.event$.pipe(filter((e) => e.type === type)) as Observable<DomainEvent<T>>;
  }

  async waitFor<T>(type: string): Promise<T> {
    const event = await firstValueFrom(this.event$.pipe(filter((e) => e.type === type)));

    switch (event.status) {
      case 'success':
      case 'event':
        return event.payload as T;

      case 'error':
        throw new Error(event?.errorCode ?? 'errors.unknownError');
    }
  }
}
