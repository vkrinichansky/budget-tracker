import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  WritableSignal,
  signal,
} from '@angular/core';
import { CheckboxGroup } from '../../models';

@Component({
  selector: 'app-checkbox-group',
  templateUrl: './checkbox-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckboxGroupComponent implements OnChanges {
  private _checkboxGroup: WritableSignal<CheckboxGroup>;

  @Input()
  set checkboxGroup(value: CheckboxGroup) {
    this._checkboxGroup = signal<CheckboxGroup>(value);
  }

  @Input()
  menuClosed = false;

  get checkboxGroup(): CheckboxGroup {
    return this._checkboxGroup();
  }

  get partiallyComplete(): boolean {
    const group = this.checkboxGroup;

    if (!group.subItems) {
      return false;
    }

    return (
      group.subItems.some((item) => item.checked) && !group.subItems.every((item) => item.checked)
    );
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['menuClosed']) {
      this.update(false);
    }
  }
}
