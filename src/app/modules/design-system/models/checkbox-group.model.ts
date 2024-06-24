import { InfoIconType } from './design-system';

export interface CheckboxItem {
  nameOrTranslationKey: string;
  checked: boolean;
  value?: string;
  tooltipTranslationKey?: string;
  infoIconType?: InfoIconType;
}

export interface CheckboxGroup extends CheckboxItem {
  subItems: CheckboxItem[];
}
