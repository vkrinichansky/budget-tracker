import { ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { BehaviorSubject } from 'rxjs';
import { NavigationBarItem } from '../../models';
import { ConfirmationModalService } from '@budget-tracker/design-system';
import { AppRoutes } from '@budget-tracker/shared';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent implements OnInit {
  private readonly rootTranslationKey = 'navigationBar';

  readonly navigationBarItems$ = new BehaviorSubject<NavigationBarItem[]>([]);

  isLoading: boolean;

  constructor(
    private authFacade: AuthFacadeService,
    private confirmationModalService: ConfirmationModalService
  ) {}

  ngOnInit(): void {
    this.prepareNavigationBarItems();
  }

  logOut(): void {
    this.confirmationModalService.openConfirmationModal(
      {
        questionTranslationKey: this.buildTranslationKey('logoutConfirmation'),
      },
      () => this.authFacade.logOut()
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
