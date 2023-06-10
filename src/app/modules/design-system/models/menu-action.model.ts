export interface MenuAction {
  icon?: string;
  translationKey: string;
  disabled?: boolean;
  action?: () => unknown;
}
