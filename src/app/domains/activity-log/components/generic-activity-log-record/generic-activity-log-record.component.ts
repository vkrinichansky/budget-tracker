import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostBinding,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-generic-activity-log-record',
  templateUrl: './generic-activity-log-record.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
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

  @Input()
  removeEnabled: boolean;

  @Output()
  remove = new EventEmitter<void>();

  get time(): string {
    return new Date(this.date).toLocaleTimeString('en', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }

  removeButtonClick(): void {
    this.remove.emit();
  }
}
