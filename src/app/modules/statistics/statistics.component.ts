import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StatisticsInitFacadeService } from './services';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class StatisticsComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private readonly snapshotsInitFacade: StatisticsInitFacadeService) {}

  ngOnInit(): void {
    this.snapshotsInitFacade.initData();

    this.loading$ = this.snapshotsInitFacade.isDataLoaded().pipe(map((isLoaded) => !isLoaded));
  }
}
