import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MenuAction, SnackbarHandlerService } from '@budget-tracker/design-system';
import { BehaviorSubject } from 'rxjs';
import { MetadataFacadeService } from '../../services';
import { LanguagesEnum, predefinedLanguagesDictionary } from '../../models';

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

  readonly loading$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly metadataFacade: MetadataFacadeService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.currentLanguage = this.metadataFacade.currentLanguage;
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
      action: async () => {
        try {
          this.loading$.next(true);

          await this.metadataFacade.changeLanguage(key as LanguagesEnum);

          location.reload();
        } catch {
          this.snackbarHandler.showGeneralErrorSnackbar();
          this.loading$.next(false);
        }
      },
      disabled: key === this.currentLanguage,
    }));
  }
}
