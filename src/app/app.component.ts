import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppComponent implements OnInit {
  isLoggedIn$: Observable<boolean>;

  constructor(private readonly authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    this.authFacade.initAuthState();

    this.isLoggedIn$ = this.authFacade.isLoggedIn();
  }
}
