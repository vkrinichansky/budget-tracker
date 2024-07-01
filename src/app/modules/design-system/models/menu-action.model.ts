import { Observable } from 'rxjs';

export interface MenuAction {
  icon?: string;
  translationKey: string;
  disabled?: boolean;
  disabledObs?: Observable<boolean>;
  action?: () => unknown;
}
