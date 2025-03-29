import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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
  private readonly dataInitFacade = inject(DataInitFacadeService);
  private readonly authFacade = inject(AuthFacadeService);

  isLoaded$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  ngOnInit(): void {
    this.isLoaded$ = this.dataInitFacade.isDataLoaded();
    this.isLoggedIn$ = this.authFacade.isLoggedIn();
  }
}
