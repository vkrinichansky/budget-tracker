import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrenciesEnum, CurrencyService, LanguageService } from '@budget-tracker/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private currencyService: CurrencyService, private languageService: LanguageService) {
    this.languageService.initLanguage();
    this.setCurrency();
  }

  private setCurrency(): void {
    const currency = this.currencyService.getCurrencyFromLS();

    if (currency) {
      this.currencyService.setCurrency(currency);
    } else {
      this.currencyService.setCurrencyToLS(CurrenciesEnum.Dollar);
      this.currencyService.setCurrency(CurrenciesEnum.Dollar);
    }
  }
}
