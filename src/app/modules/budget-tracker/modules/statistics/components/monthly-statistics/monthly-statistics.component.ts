import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { CurrencyService } from '@budget-tracker/shared';
import { ChartData, ChartOptions, Plugin, TooltipItem } from 'chart.js';
import { Observable } from 'rxjs';
import { ChartJSTooltipConfig, MainPalette } from '@budget-tracker/design-system';
import { BaseChartDirective } from 'ng2-charts';
import { StatisticsFacadeService } from '@budget-tracker/data';
import { TranslateService } from '@ngx-translate/core';

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
  @ViewChild('chart')
  private chart: BaseChartDirective;

  readonly chartOptions: ChartOptions = this.getChartOptions();
  readonly zoomOptions: ZoomOption[] = this.getZoomOptions();

  chartData$: Observable<ChartData>;

  constructor(
    private statisticsFacade: StatisticsFacadeService,
    private currencyService: CurrencyService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.chartData$ = this.statisticsFacade.getDataForMonthlyStatisticsChart();
  }

  buildTranslationKey(key: string): string {
    return `statistics.monthlyStatistics.${key}`;
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
    const scaleOptions = {
      stacked: true,
      grid: {
        color: MainPalette.Grey,
      },
      ticks: {
        color: MainPalette.Charcoal,
        font: {
          family: 'Inter',
          size: 12,
          weight: 'bold',
        },
      },
    };

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
            label: (item) => this.resolveChartTooltip(item),
            title: () => '',
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
        x: scaleOptions,
        y: scaleOptions,
      },
    };
  }

  private resolveChartTooltip(item: TooltipItem<any>): string {
    const currency = this.currencyService.getCurrencySymbol();
    const totalText = this.translateService.instant(this.buildTranslationKey('total'));

    const total = Object.values(Object.values((item.parsed._stacks['y'] as any)['_visualValues']) as number[]).reduce(
      (result: number, value: number) => result + value,
      0
    );

    return `${item.dataset.label} - ${item.parsed.y}${currency} | ${totalText} ${total}${currency}`;
  }
}
