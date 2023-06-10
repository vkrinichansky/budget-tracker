import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrenciesEnum, CurrencyService, LanguageService, LanguagesEnum } from '@budget-tracker/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private currencyService: CurrencyService, private languageService: LanguageService) {
    this.setLanguage();
    this.setCurrency();
  }

  private setLanguage(): void {
    const language = this.languageService.getLanguageFromLS();

    if (language) {
      this.languageService.setLanguage(language);
    } else {
      this.languageService.setLanguageToLS(LanguagesEnum.English);
      this.languageService.setLanguage(LanguagesEnum.English);
    }
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
