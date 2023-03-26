import { InfoCardValueToEdit } from './info-card-value-to-edit.enum';
import { InfoCardMenuActionsType } from './info-card-menu-actions-type.enum';

export interface InfoCardValueModalData {
  actionType: InfoCardMenuActionsType;
  valueToEdit: InfoCardValueToEdit;
  initialValue: number;
}
