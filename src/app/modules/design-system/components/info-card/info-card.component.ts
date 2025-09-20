import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  HostBinding,
  Input,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-info-card',
  templateUrl: './info-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class InfoCardComponent {
  @HostBinding('class')
  private readonly classes =
    'flex py-4 px-5 rounded-lg h-28 justify-start items-center gap-x-5 relative';

  @ContentChild('content')
  protected content: TemplateRef<unknown>;

  @HostBinding('style.background-color')
  @Input()
  bgColor: string;

  @HostBinding('style.color')
  @Input()
  textColor: string;

  @Input()
  primaryText: string | number;

  @Input()
  secondaryText: string;

  @Input()
  tertiaryText: string;

  @Input()
  iconName: string;
}
