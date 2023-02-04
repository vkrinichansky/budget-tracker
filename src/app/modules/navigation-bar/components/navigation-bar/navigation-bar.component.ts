import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { BehaviorSubject } from 'rxjs';
import { AppRoutes } from '@budget-tracker/shared';
import { NavigationBarItem } from '../../models';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  readonly navigationBarItems$ = new BehaviorSubject<NavigationBarItem[]>([]);

  constructor(private authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    this.prepareNavigationBarItems();
  }

  logOut(): void {
    this.authFacade.logOut();
  }

  private prepareNavigationBarItems(): void {
    const items: NavigationBarItem[] = [
      {
        iconName: 'home',
        routerLink: AppRoutes.Dashboard,
      },
    ];

    this.navigationBarItems$.next(items);
  }
}
