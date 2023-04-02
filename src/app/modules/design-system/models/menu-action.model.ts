export interface MenuAction {
  icon?: string;
  text: string;
  disabled?: boolean;
  action?: () => unknown;
}
