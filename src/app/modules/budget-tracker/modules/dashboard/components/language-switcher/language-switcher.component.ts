import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MetadataFacadeService } from '@budget-tracker/data';
import { MenuAction } from '@budget-tracker/design-system';
import { LanguagesEnum, LanguageService, predefinedLanguagesDictionary } from '@budget-tracker/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent implements OnInit {
  readonly currentLanguage = this.languageService.getCurrentLanguage();
  readonly currentLanguageText = predefinedLanguagesDictionary[this.currentLanguage].code;
  readonly menuActions: MenuAction[] = this.getMenuActions();
  readonly icon = predefinedLanguagesDictionary[this.currentLanguage].icon;

  isLoading$: Observable<boolean>;

  constructor(
    private languageService: LanguageService,
    private metadataFacade: MetadataFacadeService
  ) {}

  ngOnInit(): void {
    this.isLoading$ = this.metadataFacade.getLanguageChangingInProgress();
  }

  buildTranslationKey(key: string): string {
    return `languageSwitcher.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(predefinedLanguagesDictionary).map((key) => ({
      icon: predefinedLanguagesDictionary[key].icon,
      translationKey: `languages.${key}`,
      action: () => this.metadataFacade.changeLanguage(key as LanguagesEnum),
      disabled: key === this.currentLanguage,
    }));
  }
}
