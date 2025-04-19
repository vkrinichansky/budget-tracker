import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyFacadeService } from '../../services';

@Pipe({
  name: 'currencySymbol',
  standalone: false,
})
export class CurrencyPipe implements PipeTransform {
  constructor(private readonly currencyFacade: CurrencyFacadeService) {}

  transform(value: string | number): string {
    return `${value} ${this.currencyFacade.getCurrencySymbol()}`;
  }
}
