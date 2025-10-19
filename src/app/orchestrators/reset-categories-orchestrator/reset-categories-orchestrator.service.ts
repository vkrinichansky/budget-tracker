import { Injectable } from '@angular/core';
import { firstValueFrom, map } from 'rxjs';
import { BatchOperationService, DomainEvent, EventBusService } from '@budget-tracker/shared-utils';
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
import { BaseOrchestratorService } from '../base-orchestrator.service';

@Injectable()
export class ResetCategoriesOrchestratorService extends BaseOrchestratorService {
  constructor(
    private readonly categoryFacade: CategoryFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    eventBusService: EventBusService,
    batchOperationService: BatchOperationService
  ) {
    super(eventBusService, batchOperationService);
  }

  listen(): void {
    this.handleEvent<ResetCategoriesEvent>(CategoryEvents.RESET_CATEGORIES_START);
  }

  protected async eventCallback(event: DomainEvent<ResetCategoriesEvent>): Promise<void> {
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

      this.eventBusService.emit({
        type: CategoryEvents.RESET_CATEGORIES_FINISH,
        status: 'success',
      });
    } catch (error) {
      this.eventBusService.emit({
        type: CategoryEvents.RESET_CATEGORIES_FINISH,
        status: 'error',
        errorCode: 'errors.category.resetCategoriesFlowFailed',
      });
    }
  }
}
