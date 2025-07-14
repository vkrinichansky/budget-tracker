import { Injectable } from '@angular/core';
import { EventBusService, getErrorMessage } from '@budget-tracker/utils';
import {
  MetadataEvents,
  MetadataFacadeService,
  CurrencyChangeEvent,
} from '@budget-tracker/metadata';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';
import { CategoryFacadeService } from '@budget-tracker/category';
import {
  ActivityLogFacadeService,
  createCurrencyChangeRecord,
  CurrencyChangeRecord,
} from '@budget-tracker/activity-log';

@Injectable()
export class CurrencyChangeOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly eventBusService: EventBusService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService
  ) {}

  listen(): void {
    this.eventBusService
      .on<CurrencyChangeEvent>(MetadataEvents.CURRENCY_CHANGE_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          await this.metadataFacade.changeCurrency(event.payload.newCurrency);

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

          await this.categoryFacade.updateCategories(updatedCategories);

          const currencyChangeRecord: CurrencyChangeRecord = createCurrencyChangeRecord(
            this.metadataFacade.currentCurrency,
            event.payload.newCurrency
          );

          await this.activityLogFacade.addRecord(currencyChangeRecord);

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
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
