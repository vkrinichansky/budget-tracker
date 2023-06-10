import { Injectable } from '@angular/core';
import { LanguageLSKey, LanguagesEnum } from '../../models';
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {
  constructor(private translateService: TranslateService) {}

  setLanguageToLS(language: LanguagesEnum): void {
    localStorage.setItem(LanguageLSKey, language);
  }

  getLanguageFromLS(): LanguagesEnum | undefined {
    const language = localStorage.getItem(LanguageLSKey);
    if (language) {
      return language as LanguagesEnum;
    }
    return undefined;
  }

  setLanguage(language: LanguagesEnum): void {
    this.translateService.setDefaultLang(language);
    this.translateService.use(language);
  }

  getLanguage(): string {
    return this.translateService.getDefaultLang();
  }
}
