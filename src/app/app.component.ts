import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CurrencyService, LanguageService } from '@budget-tracker/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private currencyService: CurrencyService, private languageService: LanguageService) {
    this.languageService.initLanguage();
    this.currencyService.initCurrency();
  }
}
