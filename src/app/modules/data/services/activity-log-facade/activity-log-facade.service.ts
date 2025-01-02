import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, firstValueFrom, map } from 'rxjs';
import { ActivityLogActions, ActivityLogSelectors, CategoriesSelectors } from '../../store';
import {
  ActivityLog,
  ActivityLogGroupedByDay,
  CategoryValueChangeRecord,
  ActivityLogRecordUnitedType,
  BudgetType,
} from '../../models';
import { Dictionary } from '@ngrx/entity';
import { CategoriesFacadeService } from '../categories-facade/categories-facade.service';
import { AccountsFacadeService } from '../accounts-facade/accounts-facade.service';
import { LanguageService } from '../language-service/language.service';
import { CurrencyExchangeService } from '../currency-exchange-service/currency-exchange.service';
import { CurrencyService } from '../currency-service/currency.service';

@Injectable()
export class ActivityLogFacadeService {
  private readonly currencyService = inject(CurrencyService);
  private readonly currencyExchangeService = inject(CurrencyExchangeService);

  constructor(
    private store: Store,
    private languageService: LanguageService,
    private categoriesFacade: CategoriesFacadeService,
    private accountsFacade: AccountsFacadeService
  ) {}

  getActivityLogDictionary(): Observable<Dictionary<ActivityLogRecordUnitedType>> {
    return this.store.select(ActivityLogSelectors.activityLogDictionarySelector);
  }

  getActivityLog(): Observable<ActivityLog> {
    return this.store.select(ActivityLogSelectors.activityLogSelector);
  }

  getActivityLogGroupedByDays(): Observable<ActivityLogGroupedByDay[]> {
    const language = this.languageService.getCurrentLanguage();

    return this.store.select(
      ActivityLogSelectors.activityLogGroupedByDaysSelector(
        language,
        this.currencyService.getCurrentCurrency(),
        this.currencyExchangeService.getCurrentExchangeRate()
      )
    );
  }

  isActivityLogRecordRemoving(recordId: string): Observable<boolean> {
    return this.store.select(ActivityLogSelectors.isActivityLogRecordRemovingSelector(recordId));
  }

  isBulkRecordsRemovingInProgress(): Observable<boolean> {
    return this.store.select(ActivityLogSelectors.isBulkRecordsRemovingInProgressSelector);
  }

  doesCategoryExist(categoryId: string): Observable<boolean> {
    return this.store
      .select(CategoriesSelectors.selectCategoryByIdSelector(categoryId))
      .pipe(map((category) => !!category));
  }

  // RECORDS REMOVING
  removeActivityLogRecord(recordId: string): void {
    this.store.dispatch(ActivityLogActions.removeRecord({ recordId }));
  }

  async removeCategoryValueChangeRecord(recordId: string): Promise<void> {
    const record: CategoryValueChangeRecord = await firstValueFrom(
      this.getActivityLogDictionary().pipe(
        map((dictionary) => dictionary[recordId] as CategoryValueChangeRecord)
      )
    );
    const category = structuredClone(
      await firstValueFrom(this.categoriesFacade.getCategoryById(record.category.id))
    );
    const account = structuredClone(
      await firstValueFrom(this.accountsFacade.getAccountById(record.account.id))
    );

    const updatedCategoryValue =
      category.value - record.convertedValue < 0 ? 0 : category.value - record.convertedValue;

    let updatedAccountValue: number = null;

    if (account) {
      switch (record.budgetType) {
        case BudgetType.Income:
          updatedAccountValue = account.value - record.value < 0 ? 0 : account.value - record.value;

          break;

        case BudgetType.Expense:
          updatedAccountValue = account.value + record.value;

          break;
      }
    }

    this.store.dispatch(
      ActivityLogActions.removeCategoryValueChangeRecord({
        record,
        updatedAccountId: record.account.id,
        updatedAccountValue,
        updatedCategoryId: record.category.id,
        updatedCategoryValue,
      })
    );
  }

  async removeAllRecords(): Promise<void> {
    this.store.dispatch(ActivityLogActions.bulkRecordsRemove());
  }
}
