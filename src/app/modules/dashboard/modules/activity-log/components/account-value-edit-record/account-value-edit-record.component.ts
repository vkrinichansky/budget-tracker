import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CurrencyFacadeService } from '@budget-tracker/metadata';
import { AccountValueEditRecord } from '@budget-tracker/models';

@Component({
  selector: 'app-account-value-edit-record',
  templateUrl: './account-value-edit-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AccountValueEditRecordComponent {
  constructor(private currencyFacade: CurrencyFacadeService) {}

  @Input()
  record: AccountValueEditRecord;

  get difference(): number {
    return this.record.newValue - this.record.oldValue;
  }

  get absDifference(): number {
    return Math.abs(this.difference);
  }

  get currency(): string {
    return this.record.account.currency.symbol;
  }

  get isCurrentCurrency(): boolean {
    return this.record.account.currency.id === this.currencyFacade.getCurrentCurrency();
  }

  get convertedValue(): number {
    return Math.abs(
      this.record.account.currency.id === this.currencyFacade.getCurrentCurrency()
        ? this.difference
        : Math.round(
            this.difference /
              this.currencyFacade.getCurrentExchangeRate()[this.record.account.currency.id]
          )
    );
  }

  get symbol(): string {
    if (this.difference > 0) {
      return '\u002B';
    }

    return '\u2212';
  }

  get colorClass(): string {
    if (this.difference > 0) {
      return 'text-dark-green';
    }

    return 'text-red';
  }
}
