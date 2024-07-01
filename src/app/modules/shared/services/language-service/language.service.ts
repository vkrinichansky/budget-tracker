import { Injectable } from '@angular/core';
import { LanguageLSKey, LanguagesEnum } from '../../models';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translateService: TranslateService) {}

  setLanguageToLS(language: LanguagesEnum, shouldReload = false): void {
    localStorage.setItem(LanguageLSKey, language);

    if (shouldReload) {
      location.reload();
    }
  }

  initLanguage(): void {
    const language = localStorage.getItem(LanguageLSKey);

    if (language) {
      this.setCurrentLanguage(language as LanguagesEnum);
      return;
    }

    this.setLanguageToLS(LanguagesEnum.English);
    this.setCurrentLanguage(LanguagesEnum.English);
  }

  setCurrentLanguage(language: LanguagesEnum): void {
    this.translateService.setDefaultLang(language);
    this.translateService.use(language);
  }

  getCurrentLanguage(): string {
    return this.translateService.getDefaultLang();
  }
}
