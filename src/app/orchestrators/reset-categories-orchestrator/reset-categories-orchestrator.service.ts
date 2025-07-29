import { Injectable } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { EventBusService, getErrorMessage } from '@budget-tracker/utils';
import {
  CategoryEvents,
  ResetCategoriesEvent,
  CategoryFacadeService,
} from '@budget-tracker/category';
import {
  ActivityLogFacadeService,
  CategoriesResetRecord,
  createCategoriesResetRecord,
} from '@budget-tracker/activity-log';

@Injectable()
export class ResetCategoriesOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly eventBus: EventBusService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService
  ) {}

  listen(): void {
    this.eventBus
      .on<ResetCategoriesEvent>(CategoryEvents.RESET_CATEGORIES_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          await this.categoryFacade.resetCategoriesByType(event.payload.budgetType);

          const resetCategoriesRecord: CategoriesResetRecord = createCategoriesResetRecord(
            event.payload.budgetType
          );

          await this.activityLogFacade.addRecord(resetCategoriesRecord);

          this.eventBus.emit({
            type: CategoryEvents.RESET_CATEGORIES_FINISH,
            status: 'success',
          });
        } catch (error) {
          this.eventBus.emit({
            type: CategoryEvents.RESET_CATEGORIES_FINISH,
            status: 'error',
            errorCode: getErrorMessage(error),
          });
        }
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
