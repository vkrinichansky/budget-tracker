import { Component, HostBinding, Input } from '@angular/core';
import { predefinedCurrenciesDictionary, StatisticsSnapshot } from '@budget-tracker/models';

@Component({
  selector: 'app-snapshot-item',
  templateUrl: './snapshot-item.component.html',
  styleUrl: './snapshot-item.component.scss',
  standalone: false,
})
export class SnapshotItemComponent {
  @HostBinding('class')
  private readonly classes = 'group';

  @Input({ required: true })
  snapshot: StatisticsSnapshot;

  get currencyIcon(): string {
    return predefinedCurrenciesDictionary[this.snapshot.currency].icon;
  }

  get currencyText(): string {
    return `${predefinedCurrenciesDictionary[this.snapshot.currency].code} (${predefinedCurrenciesDictionary[this.snapshot.currency].symbol})`;
  }
}
