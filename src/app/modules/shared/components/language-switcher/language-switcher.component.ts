import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { LanguageService } from '../../services';
import { MenuAction } from '@budget-tracker/design-system';
import { LanguagesEnum, PredefinedLanguages } from '../../models';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, delay, takeUntil } from 'rxjs';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';

@Component({
  selector: 'app-language-switcher',
  templateUrl: './language-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class LanguageSwitcherComponent implements OnInit {
  private readonly rootTranslationKey = 'languageSwitcher';
  private readonly destroy$ = injectUnsubscriberService();

  menuActions$ = new BehaviorSubject<MenuAction[]>(this.getMenuActions());

  icon$ = new BehaviorSubject<string>(PredefinedLanguages[this.languageService.getLanguage()].icon);

  constructor(private languageService: LanguageService, private translateService: TranslateService) {}

  ngOnInit(): void {
    this.icon$
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe(() => this.menuActions$.next(this.getMenuActions()));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(PredefinedLanguages).map((key) => ({
      icon: PredefinedLanguages[key].icon,
      translationKey: this.buildTranslationKey(`languages.${PredefinedLanguages[key].translationKey}`),
      action: () => {
        this.languageService.setLanguageToLS(key as LanguagesEnum);
        this.languageService.setLanguage(key as LanguagesEnum);
        this.icon$.next(PredefinedLanguages[key].icon);
      },
      disabled: key === this.languageService.getLanguage(),
    }));
  }
}
