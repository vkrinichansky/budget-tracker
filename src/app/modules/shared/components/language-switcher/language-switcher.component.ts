import { Component, ChangeDetectionStrategy } from '@angular/core';
import { LanguageService } from '../../services';
import { MenuAction } from '@budget-tracker/design-system';
import { LanguagesEnum, PredefinedLanguages } from '../../models';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly currentLanguageText = PredefinedLanguages[this.currentLanguage].short;
  readonly menuActions: MenuAction[] = this.getMenuActions();
  readonly icon = PredefinedLanguages[this.currentLanguage].icon;

  constructor(private languageService: LanguageService) {}

  buildTranslationKey(key: string): string {
    return `languageSwitcher.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(PredefinedLanguages).map((key) => ({
      icon: PredefinedLanguages[key].icon,
      translationKey: this.buildTranslationKey(`languages.${PredefinedLanguages[key].translationKey}`),
      action: () => this.languageService.setLanguageToLS(key as LanguagesEnum, true),
      disabled: key === this.currentLanguage,
    }));
  }
}
