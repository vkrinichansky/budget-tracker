import { Injectable } from '@angular/core';
import { firstValueFrom, map, Subject, takeUntil } from 'rxjs';
import { BatchOperationService, EventBusService } from '@budget-tracker/utils';
import {
  CategoryEvents,
  ResetCategoriesEvent,
  CategoryFacadeService,
  Category,
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
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly batchOperationService: BatchOperationService
  ) {}

  listen(): void {
    this.eventBus
      .on<ResetCategoriesEvent>(CategoryEvents.RESET_CATEGORIES_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          const categoriesIdsToReset = await firstValueFrom(
            this.categoryFacade
              .getCategoriesByType(event.payload.budgetType)
              .pipe(map((categories) => categories.map((category) => category.id)))
          );

          const resetCategoriesRecord: CategoriesResetRecord = createCategoriesResetRecord(
            event.payload.budgetType
          );

          await this.batchOperationService.executeBatchOperation([
            {
              docRef: this.categoryFacade.getCategoryDocRef(),
              type: 'update',
              data: categoriesIdsToReset.reduce(
                (result, categoryId) => ({ ...result, [`${categoryId}.value`]: 0 }),
                {}
              ),
            },
            {
              docRef: this.activityLogFacade.getActivityLogDocRef(),
              type: 'update',
              data: { [resetCategoriesRecord.id]: resetCategoriesRecord },
            },
          ]);

          this.categoryFacade.updateCategories(
            categoriesIdsToReset.map(
              (categoryId) =>
                ({
                  id: categoryId,
                  value: 0,
                }) as Category
            )
          );

          this.activityLogFacade.addRecord(resetCategoriesRecord);

          this.eventBus.emit({
            type: CategoryEvents.RESET_CATEGORIES_FINISH,
            status: 'success',
          });
        } catch (error) {
          this.eventBus.emit({
            type: CategoryEvents.RESET_CATEGORIES_FINISH,
            status: 'error',
            errorCode: 'errors.category.resetCategoriesFlowFailed',
          });
        }
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
