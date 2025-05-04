import { Injectable } from '@angular/core';
import { BudgetType, Category, StatisticsSnapshot } from '@budget-tracker/models';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { StatisticsSelectors } from '../../store';
import {
  CurrencyFacadeService,
  CurrencyPipe,
  LanguageFacadeService,
} from '@budget-tracker/metadata';
import {
  MainPalette,
  NumberSpacePipe,
  StackedBarChartOptions,
  getStackedBarChartConfig,
} from '@budget-tracker/design-system';
import { ApexAxisChartSeries } from 'ngx-apexcharts';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class StatisticsFacadeService {
  constructor(
    private readonly store: Store,
    private readonly languageFacade: LanguageFacadeService,
    private readonly translateService: TranslateService,
    private readonly currencyPipe: CurrencyPipe,
    private readonly numberSpacePipe: NumberSpacePipe,
    private readonly currencyFacade: CurrencyFacadeService
  ) {}

  getSnapshots(): Observable<StatisticsSnapshot[]> {
    const language = this.languageFacade.getCurrentLanguage();

    return this.store.select(StatisticsSelectors.statisticsSnapshotsSelector(language));
  }

  getDataForMonthlyStatisticsChart(): Observable<StackedBarChartOptions> {
    return this.getSnapshots().pipe(
      map((snapshots) => {
        const categories = snapshots.flatMap((snapshot) => snapshot.categories);
        const categoriesIds = Array.from(new Set(categories.map((category) => category.id)));

        const uniqueCategories: Pick<Category, 'id' | 'name' | 'budgetType' | 'hexColor'>[] =
          categoriesIds.map((categoryId) => {
            const category = categories.find((category) => category.id === categoryId);

            return {
              id: category.id,
              budgetType: category.budgetType,
              name: category.name,
              hexColor: category.hexColor,
            };
          });

        const series: ApexAxisChartSeries = uniqueCategories.map((category) => ({
          name: `${this.translateService.instant(category.name)}*${category.id}`,
          group: category.budgetType,
          data: snapshots.map((snapshot) => {
            const value = snapshot.categories.find(
              (categoryToCheck) => categoryToCheck.id === category.id
            )?.value;

            return value
              ? this.currencyFacade.convertCurrency(
                  value,
                  snapshot.currency,
                  this.currencyFacade.getCurrentCurrency()
                )
              : null;
          }),
        }));

        const width = 100 * 3 * snapshots.length;
        const height = 350;
        const xaxisLabels = snapshots.map((snapshot) => snapshot.date);
        const colors = uniqueCategories.map((category) => category.hexColor);
        const strokeColors = uniqueCategories.map((category) => {
          switch (category.budgetType) {
            case BudgetType.Income:
              return MainPalette.DarkGreen;

            case BudgetType.Expense:
              return MainPalette.DarkRed;
          }
        });

        return getStackedBarChartConfig(
          series,
          width,
          height,
          xaxisLabels,
          strokeColors,
          colors,
          (label, value) =>
            `${label.split('*')[0]} - ${this.currencyPipe.transform(this.numberSpacePipe.transform(value))}`
        );
      })
    );
  }
}
