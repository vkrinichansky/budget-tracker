import { ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { BehaviorSubject } from 'rxjs';
import { NavigationBarItem } from '../../models';
import { ConfirmationModalService } from '@budget-tracker/design-system';
import { AppRoutes } from '@budget-tracker/utils';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent implements OnInit {
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
        questionTranslationKey: 'navigationBar.logoutConfirmation',
      },
      () => this.authFacade.logOut()
    );
  }

  private prepareNavigationBarItems(): void {
    const items: NavigationBarItem[] = [
      {
        iconName: 'home',
        tooltipTranslationKey: 'navigationBar.itemTooltip.home',
        routerLink: AppRoutes.Dashboard,
      },
      {
        iconName: 'statistics',
        tooltipTranslationKey: 'navigationBar.itemTooltip.statistics',
        routerLink: AppRoutes.Statistics,
      },
    ];

    this.navigationBarItems$.next(items);
  }
}
