import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { MetadataFacadeService } from '@budget-tracker/metadata';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit {
  loading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private readonly metadataFacade: MetadataFacadeService,
    private readonly authFacade: AuthFacadeService
  ) {}

  ngOnInit(): void {
    this.authFacade.initAuthState();
    this.metadataFacade.initMetadata();

    this.loading$ = this.metadataFacade.isMetadataLoaded().pipe(map((isLoaded) => !isLoaded));
    this.isLoggedIn$ = this.authFacade.isLoggedIn();
  }
}
