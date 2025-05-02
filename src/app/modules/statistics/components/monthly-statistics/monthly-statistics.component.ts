import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StackedBarChartOptions } from '@budget-tracker/design-system';
import { StatisticsFacadeService } from '../../services';

@Component({
  selector: 'app-monthly-statistics',
  templateUrl: './monthly-statistics.component.html',
  styleUrls: ['./monthly-statistics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class MonthlyStatisticsComponent implements OnInit {
  chartData$: Observable<StackedBarChartOptions>;

  constructor(private readonly statisticsFacade: StatisticsFacadeService) {}

  ngOnInit(): void {
    this.chartData$ = this.statisticsFacade.getDataForMonthlyStatisticsChart();
  }
}
