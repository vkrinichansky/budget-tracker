import { ChangeDetectionStrategy } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { NavigationBarItem } from '../../models';
import { ConfirmationModalService, SnackbarHandlerService } from '@budget-tracker/design-system';
import { AppRoutes } from '@budget-tracker/shared-models';
import { getErrorMessage, NavigatorService } from '@budget-tracker/shared-utils';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class NavigationBarComponent {
  readonly navigationBarItems: NavigationBarItem[] = [
    {
      iconName: 'home',
      tooltipTranslationKey: 'navigationBar.itemTooltip.home',
      routerLink: `/${AppRoutes.DASHBOARD}`,
    },
    {
      iconName: 'statistics',
      tooltipTranslationKey: 'navigationBar.itemTooltip.statistics',
      routerLink: `/${AppRoutes.STATISTICS}`,
    },
  ];

  constructor(
    private readonly snackbarHandler: SnackbarHandlerService,
    private readonly navigator: NavigatorService,
    private readonly authFacade: AuthFacadeService,
    private readonly confirmationModalService: ConfirmationModalService
  ) {}

  logOut(): void {
    this.confirmationModalService.openConfirmationModal(
      {
        questionTranslationKey: 'navigationBar.logoutConfirmation',
      },
      async () => {
        try {
          await this.authFacade.logOut();
          this.navigator.navigateToAuthPage();
        } catch (error) {
          this.snackbarHandler.showErrorSnackbar(getErrorMessage(error));
        }
      }
    );
  }
}
