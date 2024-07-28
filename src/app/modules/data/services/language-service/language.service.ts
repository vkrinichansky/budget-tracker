import { Injectable } from '@angular/core';
import { LanguagesEnum } from '../../models';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private translateService: TranslateService) {}

  setCurrentLanguage(language: LanguagesEnum): void {
    this.translateService.setDefaultLang(language);
    this.translateService.use(language);
  }

  getCurrentLanguage(): string {
    return this.translateService.getDefaultLang();
  }
}
