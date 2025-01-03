import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { DataInitFacadeService } from '@budget-tracker/data';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  isLoaded$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private dataInitFacade: DataInitFacadeService,
    private authFacade: AuthFacadeService
  ) {}

  ngOnInit(): void {
    this.isLoaded$ = this.dataInitFacade.isDataLoaded();
    this.isLoggedIn$ = this.authFacade.isLoggedIn();
  }
}
