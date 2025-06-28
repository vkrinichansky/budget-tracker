import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MenuAction } from '@budget-tracker/design-system';
import { LanguagesEnum, predefinedLanguagesDictionary } from '@budget-tracker/models';
import { Observable, of } from 'rxjs';
import { MetadataFacadeService, MetadataService } from '../../services';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class LanguageSwitcherComponent implements OnInit {
  currentLanguage: LanguagesEnum;
  currentLanguageText: string;
  icon: string;
  menuActions: MenuAction[];

  isLoading$: Observable<boolean> = of(false);

  constructor(
    private metadataService: MetadataService,
    private metadataFacade: MetadataFacadeService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.metadataService.getCurrentLanguage();
    this.currentLanguageText = predefinedLanguagesDictionary[this.currentLanguage].code;
    this.icon = predefinedLanguagesDictionary[this.currentLanguage].icon;

    this.menuActions = this.getMenuActions();
  }

  buildTranslationKey(key: string): string {
    return `languageSwitcher.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return (Object.keys(predefinedLanguagesDictionary) as LanguagesEnum[]).map((key) => ({
      icon: predefinedLanguagesDictionary[key].icon,
      translationKey: `languages.${key}`,
      action: () => this.metadataFacade.changeLanguage(key as LanguagesEnum),
      disabled: key === this.currentLanguage,
    }));
  }
}
