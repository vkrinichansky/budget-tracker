import { ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { AppRoutes } from '@budget-tracker/shared';
import { NavigationBarItem } from '../../models';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { BudgetTrackerFacadeService } from '@budget-tracker/budget-tracker';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [provideUnsubscriberService()],
})
export class NavigationBarComponent implements OnInit {
  private readonly rootTranslationKey = 'navigationBar';
  private readonly destroy$ = injectUnsubscriberService();

  @HostBinding('class.loading')
  private get classes(): boolean {
    return this.isLoading;
  }

  readonly navigationBarItems$ = new BehaviorSubject<NavigationBarItem[]>([]);

  isLoading: boolean;

  constructor(
    private authFacade: AuthFacadeService,
    private btFacade: BudgetTrackerFacadeService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.prepareNavigationBarItems();

    this.btFacade
      .isDataLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
        this.cd.detectChanges();
      });
  }

  logOut(): void {
    this.authFacade.logOut();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }

  private prepareNavigationBarItems(): void {
    const items: NavigationBarItem[] = [
      {
        iconName: 'home',
        tooltipTranslationKey: this.buildTranslationKey('itemTooltip.home'),
        routerLink: AppRoutes.Dashboard,
      },
    ];

    this.navigationBarItems$.next(items);
  }
}
