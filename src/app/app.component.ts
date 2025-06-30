import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';
import { MetadataFacadeService } from '@budget-tracker/metadata';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AppComponent implements OnInit {
  loading$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  constructor(
    private readonly metadataFacade: MetadataFacadeService,
    private readonly authFacade: AuthFacadeService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.authFacade.initAuthState();

    this.loading$ = this.metadataFacade.isMetadataLoadedObs().pipe(map((isLoaded) => !isLoaded));
    this.isLoggedIn$ = this.authFacade.isLoggedIn();

    this.isLoggedIn$
      .pipe(
        filter((isLoggedIn) => isLoggedIn),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.metadataFacade.initMetadata());
  }
}
