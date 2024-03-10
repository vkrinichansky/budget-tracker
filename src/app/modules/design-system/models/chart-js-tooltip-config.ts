import { TooltipOptions } from 'chart.js';
import { MainPalette } from './main-palette';

export const ChartJSTooltipConfig: TooltipOptions = {
  bodyFont: {
    family: 'Inter',
    size: 14,
    lineHeight: 1.5,
  },
  cornerRadius: 4,
  caretSize: 6,
  borderWidth: 0,
  backgroundColor: MainPalette.Charcoal,
  displayColors: false,
  padding: {
    x: 8,
    y: 4,
  },
  yAlign: 'bottom',
  xAlign: 'center',
} as TooltipOptions;
