import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexStates,
  ApexTooltip,
} from 'ngx-apexcharts';
import { MainPalette } from './design-system';

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  labels: string[];
  colors: string[];
  dataLabels: ApexDataLabels;
  legend: ApexLegend;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  states: ApexStates;
  tooltip: ApexTooltip;
};

export function getPieChartConfig(
  series: number[],
  labels: string[],
  colors: string[],
  tooltipValueCallback: (label: string, value: number) => string
): PieChartOptions {
  return {
    chart: {
      type: 'pie',
    },
    series,
    labels,
    colors,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: [MainPalette.Charcoal],
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    tooltip: {
      custom: ({ series, seriesIndex, _, w }) => {
        const label: string = w.globals.labels[seriesIndex];
        const value: number = series[seriesIndex];

        return `
              <div class="apex-tooltip">
                ${tooltipValueCallback(label, value)} 
              </div>
            `;
      },
    },
  };
}
