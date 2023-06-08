import { ChangeDetectionStrategy, HostBinding, OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { BehaviorSubject } from 'rxjs';
import { AppRoutes } from '@budget-tracker/shared';
import { NavigationBarItem } from '../../models';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationBarComponent implements OnInit {
  private readonly rootTranslationKey = 'navigationBar';

  @HostBinding('class')
  private readonly classes = 'flex flex-col justify-between items-center w-16 bg-charcoal py-5';

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
