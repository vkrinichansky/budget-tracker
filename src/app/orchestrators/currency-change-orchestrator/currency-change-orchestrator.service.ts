import { Injectable } from '@angular/core';
import {
  BatchOperationService,
  DomainEvent,
  EventBusService,
  getErrorMessage,
} from '@budget-tracker/shared-utils';
import {
  MetadataEvents,
  MetadataFacadeService,
  CurrencyChangeEvent,
} from '@budget-tracker/metadata';
import { firstValueFrom } from 'rxjs';
import { Category, CategoryFacadeService } from '@budget-tracker/category';
import {
  ActivityLogFacadeService,
  createCurrencyChangeRecord,
  CurrencyChangeRecord,
} from '@budget-tracker/activity-log';
import { BaseOrchestratorService } from '@budget-tracker/orchestrators-utils';
import { deleteField } from '@angular/fire/firestore';
@Injectable()
export class CurrencyChangeOrchestratorService extends BaseOrchestratorService {
  constructor(
    private readonly metadataFacade: MetadataFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    eventBusService: EventBusService,
    batchOperationService: BatchOperationService
  ) {
    super(eventBusService, batchOperationService);
  }

  listen(): void {
    this.handleEvent<CurrencyChangeEvent>(MetadataEvents.CURRENCY_CHANGE_START);
  }

  protected async eventCallback(event: DomainEvent<CurrencyChangeEvent>): Promise<void> {
    try {
      const updatedCategories = structuredClone(
        await firstValueFrom(this.categoryFacade.getAllCategories())
      );

      updatedCategories.forEach((category) => {
        category.value = this.metadataFacade.convertCurrency(
          category.value,
          this.metadataFacade.currentCurrency,
          event.payload.newCurrency
        );
      });

      const currencyChangeRecord: CurrencyChangeRecord = createCurrencyChangeRecord(
        this.metadataFacade.currentCurrency,
        event.payload.newCurrency
      );

      const allRecords = await firstValueFrom(this.activityLogFacade.getAllRecords());

      await this.batchOperationService.executeBatchOperation([
        {
          docRef: this.metadataFacade.getMetadataDocRef(),
          type: 'update',
          data: { currency: event.payload.newCurrency },
        },
        {
          docRef: this.categoryFacade.getCategoryDocRef(),
          type: 'update',
          data: updatedCategories.reduce(
            (result, category) => ({
              ...result,
              [`${category.id}`]: category,
            }),
            {} as Record<string, Category>
          ),
        },

        {
          docRef: this.activityLogFacade.getActivityLogDocRef(),
          type: 'update',
          data: allRecords.reduce(
            (result, record) => ({
              ...result,
              [`${record.id}`]: deleteField(),
              [`${currencyChangeRecord.id}`]: currencyChangeRecord,
            }),
            {}
          ),
        },
      ]);

      this.eventBusService.emit({
        type: MetadataEvents.CURRENCY_CHANGE_FINISH,
        status: 'success',
      });
    } catch (error) {
      this.eventBusService.emit({
        type: MetadataEvents.CURRENCY_CHANGE_FINISH,
        status: 'error',
        errorCode: getErrorMessage(error),
      });
    }
  }
}
