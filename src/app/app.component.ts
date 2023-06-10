import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LanguageService, LanguagesEnum } from '@budget-tracker/shared';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  constructor(private translateService: TranslateService, private languageService: LanguageService) {
    this.setLanguage();
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
}
