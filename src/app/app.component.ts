import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { CurrencyService, LanguageService } from '@budget-tracker/shared';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  @HostBinding('class')
  private readonly classes = 'block w-full h-full min-h-full overflow-hidden';

  constructor(
    private currencyService: CurrencyService,
    private languageService: LanguageService
  ) {
    this.languageService.initLanguage();
    this.currencyService.initCurrency();
  }
}
