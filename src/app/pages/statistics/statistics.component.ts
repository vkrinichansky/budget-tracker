import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { SnapshotFacadeService } from '@budget-tracker/snapshot';
import { MetadataFacadeService } from '@budget-tracker/metadata';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StatisticsComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(
    private readonly snapshotFacade: SnapshotFacadeService,
    private readonly metadataFacade: MetadataFacadeService
  ) {}

  ngOnInit(): void {
    this.metadataFacade.loadMetadata();
    this.snapshotFacade.loadSnapshots();

    this.initDataLoading();
  }

  private initDataLoading(): void {
    this.loading$ = combineLatest([
      this.metadataFacade.metadataLoaded(),
      this.snapshotFacade.snapshotsLoaded(),
    ]).pipe(map(([metadataLoaded, snapshotsLoaded]) => !metadataLoaded || !snapshotsLoaded));
  }
}
