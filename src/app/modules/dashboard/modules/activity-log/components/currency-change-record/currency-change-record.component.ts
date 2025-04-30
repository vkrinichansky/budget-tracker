import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  CurrenciesEnum,
  CurrencyChangeRecord,
  predefinedCurrenciesDictionary,
} from '@budget-tracker/models';

@Component({
  selector: 'app-currency-change-record',
  templateUrl: './currency-change-record.component.html',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencyChangeRecordComponent {
  @Input()
  record: CurrencyChangeRecord;

  getIcon(currency: CurrenciesEnum): string {
    return predefinedCurrenciesDictionary[currency].icon;
  }

  getText(currency: CurrenciesEnum): string {
    return `${predefinedCurrenciesDictionary[currency].code} (${predefinedCurrenciesDictionary[currency].symbol})`;
  }
}
