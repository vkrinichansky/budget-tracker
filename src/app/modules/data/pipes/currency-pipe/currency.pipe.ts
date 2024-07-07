import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyService } from '../../services/currency-service/currency.service';

@Pipe({
  name: 'currencySymbol',
})
export class CurrencyPipe implements PipeTransform {
  constructor(private currencyService: CurrencyService) {}

  transform(value: string | number): string {
    return `${value} ${this.currencyService.getCurrencySymbol()}`;
  }
}
