import { ChangeDetectorRef, Component, DestroyRef, HostBinding, OnInit } from '@angular/core';
import { StatisticsFacadeService } from '../../services';
import { StatisticsSnapshot } from '@budget-tracker/models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-snapshots-list',
  templateUrl: './snapshots-list.component.html',
  styleUrl: './snapshots-list.component.scss',
  standalone: false,
})
export class SnapshotsListComponent implements OnInit {
  snapshots: StatisticsSnapshot[];

  @HostBinding('class.hidden')
  private get shouldHide(): boolean {
    return !this.snapshots?.length;
  }

  constructor(
    private readonly statisticsFacade: StatisticsFacadeService,
    private readonly destroyRef: DestroyRef,
    private readonly cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.statisticsFacade
      .getSnapshots()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((snapshots) => {
        this.snapshots = snapshots;
        this.cd.detectChanges();
      });
  }
}
