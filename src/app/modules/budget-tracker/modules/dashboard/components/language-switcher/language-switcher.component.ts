import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MenuAction } from '@budget-tracker/design-system';
import { LanguageService, LanguagesEnum, predefinedLanguagesDictionary } from '@budget-tracker/utils';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly currentLanguageText = predefinedLanguagesDictionary[this.currentLanguage].code;
  readonly menuActions: MenuAction[] = this.getMenuActions();
  readonly icon = predefinedLanguagesDictionary[this.currentLanguage].icon;

  constructor(private languageService: LanguageService) {}

  buildTranslationKey(key: string): string {
    return `languageSwitcher.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(predefinedLanguagesDictionary).map((key) => ({
      icon: predefinedLanguagesDictionary[key].icon,
      translationKey: `languages.${key}`,
      action: () => this.languageService.setLanguageToLS(key as LanguagesEnum, true),
      disabled: key === this.currentLanguage,
    }));
  }
}
