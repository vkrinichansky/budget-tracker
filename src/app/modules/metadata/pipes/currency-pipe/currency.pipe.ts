import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyFacadeService } from '../../services';
import { CurrenciesEnum, predefinedCurrenciesDictionary } from '@budget-tracker/models';

@Pipe({
  name: 'currencySymbol',
  standalone: false,
})
export class CurrencyPipe implements PipeTransform {
  constructor(private readonly currencyFacade: CurrencyFacadeService) {}

  transform(value: string | number, currency?: CurrenciesEnum): string {
    if (currency) {
      return `${value} ${predefinedCurrenciesDictionary[currency].symbol}`;
    }

    return `${value} ${this.currencyFacade.getCurrencySymbol()}`;
  }
}
