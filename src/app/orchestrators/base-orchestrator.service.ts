import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EventBusService, BatchOperationService, DomainEvent } from '@budget-tracker/shared-utils';

@Injectable()
export abstract class BaseOrchestratorService {
  protected readonly destroy$ = new Subject<void>();

  constructor(
    protected readonly eventBusService: EventBusService,
    protected readonly batchOperationService: BatchOperationService
  ) {}

  protected abstract listen(): void;

  protected abstract eventCallback(event: DomainEvent<unknown>): Promise<void> | void;

  protected handleEvent<T>(eventType: string): void {
    this.eventBusService
      .on<T>(eventType)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event: DomainEvent<T>) => {
        await this.eventCallback(event);
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
