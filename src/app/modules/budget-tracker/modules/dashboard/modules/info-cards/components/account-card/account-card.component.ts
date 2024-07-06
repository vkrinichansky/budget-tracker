import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { Account } from '@budget-tracker/data';
import { AccountsValueEditModalService } from '../../services';
import { MenuAction } from '@budget-tracker/design-system';

@Component({
  selector: 'app-account-card',
  templateUrl: './account-card.component.html',
  styleUrl: './account-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCardComponent {
  @HostBinding('class')
  private readonly classes = 'block';

  readonly menuActions: MenuAction[] = [
    {
      icon: 'edit',
      translationKey: this.buildTranslationKey('menu.editValue'),
      action: () => this.accountValueEditModalService.openEditAccountValueModal(this.account.id),
    },
  ];
  @Input()
  account: Account;

  constructor(private accountValueEditModalService: AccountsValueEditModalService) {}

  buildTranslationKey(key: string): string {
    return `dashboard.infoCards.accountCard.${key}`;
  }
}
