import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';

@Component({
  selector: 'app-lost-connection-message',
  templateUrl: './lost-connection-message.component.html',
  styleUrl: './lost-connection-message.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LostConnectionMessageComponent {
  @HostBinding('class')
  private readonly classes =
    'flex justify-center items-center h-full w-full bg-black-transparent absolute top-0 left-0';

  buildTranslationKey(key: string): string {
    return `lostConnectionMessage.${key}`;
  }

  reload(): void {
    window.location.reload();
  }
}
