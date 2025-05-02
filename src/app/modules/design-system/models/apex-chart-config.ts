import {
  ApexNonAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexStates,
  ApexTooltip,
  ApexAxisChartSeries,
  ApexFill,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
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

export type StackedBarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  plotOptions: ApexPlotOptions;
  stroke: ApexStroke;
  xaxis: ApexXAxis;
  colors: string[];
  fill: ApexFill;
  legend: ApexLegend;
  dataLabels: ApexDataLabels;
  states: ApexStates;
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

export function getStackedBarChartConfig(
  series: ApexAxisChartSeries,
  width: number,
  height: number,
  xaxisLabels: string[],
  strokeColors: string[],
  colors: string[],
  tooltipValueCallback: (label: string, value: number) => string
): StackedBarChartOptions {
  return {
    series,
    chart: {
      type: 'bar',
      height,
      width,
      stacked: true,
      toolbar: {
        show: false,
      },
    },
    grid: {
      borderColor: MainPalette.Blue,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: true,
        },
      },
    },
    stroke: {
      width: 2,
      colors: strokeColors,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    xaxis: {
      categories: xaxisLabels,
    },
    fill: {
      opacity: 1,
    },
    colors,
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    states: {
      active: {
        filter: {
          type: 'none',
        },
      },
    },
    tooltip: {
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const categoryName = w.globals.seriesNames[seriesIndex];
        const categoryValue = series[seriesIndex][dataPointIndex];

        return `
              <div class="apex-tooltip">
              ${tooltipValueCallback(categoryName, categoryValue)}
              </div>
            `;
      },
    },
  };
}
