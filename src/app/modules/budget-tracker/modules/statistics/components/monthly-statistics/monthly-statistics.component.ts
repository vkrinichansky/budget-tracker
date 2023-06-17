import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { ActivityLogFacadeService } from '@budget-tracker/dashboard/activity-log';
import { CategoryValueChangeRecord, CurrencyService } from '@budget-tracker/shared';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { Observable, map } from 'rxjs';
import { ChartJSTooltipConfig } from '@budget-tracker/design-system';
import { BaseChartDirective } from 'ng2-charts';

import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(zoomPlugin);

interface ZoomOption {
  icon: string;
  tooltipKey: string;
  handler: () => unknown;
}

@Component({
  selector: 'app-monthly-statistics',
  templateUrl: './monthly-statistics.component.html',
  styleUrls: ['./monthly-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MonthlyStatisticsComponent implements OnInit {
  private readonly rootTranslationKey = 'statistics.monthlyStatistics';

  @ViewChild('chart')
  chart: BaseChartDirective;

  chartData$: Observable<ChartData>;
  chartOptions: ChartOptions;

  zoomOptions: ZoomOption[];

  constructor(private activityLogFacade: ActivityLogFacadeService, private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.chartOptions = this.getChartOptions();
    this.zoomOptions = this.getZoomOptions();

    this.chartData$ = this.activityLogFacade.getMonthlyStatistics().pipe(
      map((statistics) => ({
        labels: statistics.map((statisticItem) => statisticItem.date),
        datasets: [
          {
            data: statistics.map((statisticsItem) =>
              statisticsItem.income.reduce(
                (acc, currentValue) => acc + (currentValue as CategoryValueChangeRecord).value,
                0
              )
            ),
            borderColor: '#109279',
            hoverBorderColor: '#109279',
            backgroundColor: '#E4FCF7',
            hoverBackgroundColor: '#E4FCF7',
            borderWidth: 2,
            borderRadius: 2,
            borderSkipped: 'bottom',
          },
          {
            data: statistics.map((statisticsItem) =>
              statisticsItem.expense.reduce(
                (acc, currentValue) => acc + (currentValue as CategoryValueChangeRecord).value,
                0
              )
            ),
            borderColor: '#FF6B69',
            hoverBorderColor: '#FF6B69',
            backgroundColor: '#FFECEC',
            hoverBackgroundColor: '#FFECEC',
            borderWidth: 2,
            borderRadius: 2,
            borderSkipped: 'bottom',
          },
        ],
      }))
    );
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private getZoomOptions(): ZoomOption[] {
    return [
      {
        icon: 'search-plus',
        tooltipKey: this.buildTranslationKey('chartActions.zoomIn'),
        handler: () => this.chart.chart?.zoom({ x: 1.2 }),
      },
      {
        icon: 'search-minus',
        tooltipKey: this.buildTranslationKey('chartActions.zoomOut'),
        handler: () => this.chart.chart?.zoom({ x: 0.8 }),
      },
      {
        icon: 'arrow-left',
        tooltipKey: this.buildTranslationKey('chartActions.scrollLeft'),
        handler: () => this.chart.chart?.pan({ x: 200 }, undefined, 'default'),
      },
      {
        icon: 'arrow-right',
        tooltipKey: this.buildTranslationKey('chartActions.scrollRight'),
        handler: () => this.chart.chart?.pan({ x: -200 }, undefined, 'default'),
      },
      {
        icon: 'close',
        tooltipKey: this.buildTranslationKey('chartActions.resetZoom'),
        handler: () => this.chart.chart?.resetZoom(),
      },
    ];
  }

  private getChartOptions(): ChartOptions {
    return {
      responsive: true,
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          ...ChartJSTooltipConfig,
          callbacks: {
            label: (item) => {
              return `${item.label} - ${item.parsed.y}${this.currencyService.getCurrencySymbol()}`;
            },
            title: () => {
              return '';
            },
          },
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x',
          },
          zoom: {
            wheel: {
              enabled: true,
            },
            pinch: {
              enabled: true,
            },
            mode: 'x',
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: '#636766',
          },
          ticks: {
            color: '#2C4251',
            font: {
              family: 'Inter',
              size: 12,
              weight: 'bold',
            },
          },
        },
        y: {
          grid: {
            color: '#636766',
          },
          ticks: {
            color: '#2C4251',
            font: {
              family: 'Inter',
              size: 12,
              weight: 'bold',
            },
          },
        },
      },
    };
  }
}
