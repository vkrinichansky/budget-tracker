import { ChangeDetectionStrategy, ChangeDetectorRef, HostBinding, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { BehaviorSubject, takeUntil } from 'rxjs';
import { NavigationBarItem } from '../../models';
import { injectUnsubscriberService, provideUnsubscriberService } from '@budget-tracker/utils';
import { ConfirmationModalService } from '@budget-tracker/design-system';
import { DataInitFacadeService } from '@budget-tracker/data';
import { AppRoutes } from '@budget-tracker/shared';

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
    private dataInitFacade: DataInitFacadeService,
    private cd: ChangeDetectorRef,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.prepareNavigationBarItems();

    this.dataInitFacade
      .isDataLoading()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isLoading) => {
        this.isLoading = isLoading;
        this.cd.detectChanges();
      });
  }

  logOut(): void {
    this.confirmationModalService.openConfirmationModal(this.buildTranslationKey('logoutConfirmation'), undefined, () =>
      this.authFacade.logOut()
    );
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
      {
        iconName: 'statistics',
        tooltipTranslationKey: this.buildTranslationKey('itemTooltip.statistics'),
        routerLink: AppRoutes.Statistics,
      },
    ];

    this.navigationBarItems$.next(items);
  }
}
