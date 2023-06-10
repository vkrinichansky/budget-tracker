import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CurrencyService } from '../../services';
import { MenuAction } from '@budget-tracker/design-system';
import { CurrenciesEnum, PredefinedCurrencies } from '../../models';
import { BehaviorSubject, delay, takeUntil } from 'rxjs';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';

@Component({
  selector: 'app-currency-switcher',
  templateUrl: './currency-switcher.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class CurrencySwitcherComponent implements OnInit {
  private readonly rootTranslationKey = 'currencySwitcher';
  private readonly destroy$ = injectUnsubscriberService();

  menuActions$ = new BehaviorSubject<MenuAction[]>(this.getMenuActions());

  icon$ = new BehaviorSubject<string>(PredefinedCurrencies[this.currencyService.getCurrency()].icon);

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.icon$
      .pipe(delay(100), takeUntil(this.destroy$))
      .subscribe(() => this.menuActions$.next(this.getMenuActions()));
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private getMenuActions(): MenuAction[] {
    return Object.keys(PredefinedCurrencies).map((key) => ({
      icon: PredefinedCurrencies[key].icon,
      translationKey: this.buildTranslationKey(`currencies.${PredefinedCurrencies[key].translationKey}`),
      action: () => {
        this.currencyService.setCurrencyToLS(key as CurrenciesEnum);
        this.currencyService.setCurrency(key as CurrenciesEnum);
        this.icon$.next(PredefinedCurrencies[key].icon);
      },
      disabled: key === this.currencyService.getCurrency(),
    }));
  }
}
