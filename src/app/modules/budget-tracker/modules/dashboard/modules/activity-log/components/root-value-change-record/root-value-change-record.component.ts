import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { RootValueActionType, RootValueChangeRecord } from '@budget-tracker/data';
import { CurrencyService } from '@budget-tracker/shared';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root-value-change-record',
  templateUrl: './root-value-change-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RootValueChangeRecordComponent implements OnInit {
  private readonly rootTranslationKey = 'dashboard.activityLog.rootValueChangeRecord';

  readonly actionType = RootValueActionType;

  @Input()
  record: RootValueChangeRecord;

  currencySymbol$: Observable<string>;

  constructor(private currencyService: CurrencyService) {}

  ngOnInit(): void {
    this.currencySymbol$ = this.currencyService.getCurrencySymbolObs();
  }

  buildTranslationKey(key: string): string {
    return `${this.rootTranslationKey}.${key}`;
  }
}
