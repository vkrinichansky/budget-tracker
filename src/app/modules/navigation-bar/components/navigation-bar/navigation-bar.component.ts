import { ChangeDetectionStrategy, inject } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { NavigationBarItem } from '../../models';
import { ConfirmationModalService } from '@budget-tracker/design-system';
import { AppRoutes } from '@budget-tracker/utils';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent {
  private readonly authFacade = inject(AuthFacadeService);
  private readonly confirmationModalService = inject(ConfirmationModalService);

  readonly navigationBarItems: NavigationBarItem[] = [
    {
      iconName: 'home',
      tooltipTranslationKey: 'navigationBar.itemTooltip.home',
      routerLink: `/${AppRoutes.Dashboard}`,
    },
    {
      iconName: 'statistics',
      tooltipTranslationKey: 'navigationBar.itemTooltip.statistics',
      routerLink: `/${AppRoutes.Statistics}`,
    },
  ];

  logOut(): void {
    this.confirmationModalService.openConfirmationModal(
      {
        questionTranslationKey: 'navigationBar.logoutConfirmation',
      },
      () => this.authFacade.logOut()
    );
  }
}
