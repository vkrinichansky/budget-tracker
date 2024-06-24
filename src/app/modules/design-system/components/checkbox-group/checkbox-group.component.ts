import { ChangeDetectionStrategy, Component, Input, WritableSignal, signal } from '@angular/core';
import { CheckboxGroup } from '../../models';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  styleUrl: './checkbox-group.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupComponent {
  private _checkboxGroup: WritableSignal<CheckboxGroup>;

  @Input()
  set checkboxGroup(value: CheckboxGroup) {
    this._checkboxGroup = signal<CheckboxGroup>(value);
  }

  get checkboxGroup(): CheckboxGroup {
    return this._checkboxGroup();
  }

  get partiallyComplete(): boolean {
    const group = this.checkboxGroup;

    if (!group.subItems) {
      return false;
    }

    return group.subItems.some((item) => item.checked) && !group.subItems.every((item) => item.checked);
  }

  update(checked: boolean, index?: number) {
    this._checkboxGroup.update((group) => {
      if (index === undefined) {
        group.checked = checked;
        group.subItems.forEach((item) => (item.checked = checked));
      } else {
        group.subItems![index].checked = checked;
        group.checked = group.subItems.every((item) => item.checked) ?? true;
      }

      return { ...group };
    });
  }
}
