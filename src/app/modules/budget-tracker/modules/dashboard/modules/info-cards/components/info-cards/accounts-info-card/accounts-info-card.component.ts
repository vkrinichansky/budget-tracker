import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-accounts-info-card',
  templateUrl: './accounts-info-card.component.html',
  styleUrl: './accounts-info-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsInfoCardComponent {
  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.accounts.${key}`;
  }
}
