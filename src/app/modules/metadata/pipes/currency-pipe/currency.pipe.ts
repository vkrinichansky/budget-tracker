import { Pipe, PipeTransform } from '@angular/core';
import { MetadataService } from '../../services';
import { CurrenciesEnum } from '@budget-tracker/models';

@Pipe({
  name: 'currencySymbol',
  standalone: false,
})
export class CurrencyPipe implements PipeTransform {
  constructor(private readonly metadataService: MetadataService) {}

  transform(value: string | number, currency?: CurrenciesEnum): string {
    if (currency) {
      return `${value} ${this.metadataService.getCurrencySymbol(currency)}`;
    }

    return `${value} ${this.metadataService.getCurrencySymbol()}`;
  }
}
