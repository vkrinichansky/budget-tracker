import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  constructor(private readonly metadataFacade: MetadataFacadeService) {}

  ngOnInit(): void {
    this.metadataFacade.initMetadata();
    this.loading$ = this.metadataFacade.isMetadataLoaded().pipe(map((isLoaded) => !isLoaded));
  }
}
