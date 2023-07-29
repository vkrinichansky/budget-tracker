import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'app-generic-activity-log-record',
  templateUrl: './generic-activity-log-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericActivityLogRecordComponent {
  @HostBinding('class')
  private readonly classes = 'flex gap-x-2 items-center justify-start w-full';
  @Input()
  icon: string;

  @Input()
  note: string;

  @Input()
  date: number;

  get time(): string {
    return new Date(this.date).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
}
