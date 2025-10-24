import { ChangeDetectorRef, Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { SnapshotFacadeService } from '../../services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Snapshot } from '../../models';

@Component({
  selector: 'app-snapshots-list',
  templateUrl: './snapshots-list.component.html',
  styleUrl: './snapshots-list.component.scss',
  standalone: false,
})
export class SnapshotsListComponent implements OnInit {
  snapshots: Snapshot[];

  @HostBinding('class.hide')
  private get shouldHide(): boolean {
    return !this.snapshots?.length;
  }

  constructor(
    private readonly snapshotFacade: SnapshotFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.snapshotFacade
      .getSnapshots()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((snapshots) => {
        this.snapshots = snapshots;
        this.cd.detectChanges();
      });
  }
}
