import { InfoIconType } from './design-system';
import { TooltipPosition } from './tooltip';

export interface CheckboxItem {
  nameOrTranslationKey: string;
  checked: boolean;
  value?: string;
  tooltipTranslationKey?: string;
  infoIconType?: InfoIconType;
  tooltipPosition?: TooltipPosition;
}

export interface CheckboxGroup extends CheckboxItem {
  subItems: CheckboxItem[];
}
