import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { BehaviorSubject } from 'rxjs';
import { AppRoutes } from '@budget-tracker/shared';
import { NavigationBarItem } from '../../models';
import { ColorScheme } from 'src/app/modules/design-system/models/colors-set.enum';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  private readonly rootTranslationKey = 'navigationBar';

  readonly colorScheme = ColorScheme;

  readonly navigationBarItems$ = new BehaviorSubject<NavigationBarItem[]>([]);

  constructor(private authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    this.prepareNavigationBarItems();
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
