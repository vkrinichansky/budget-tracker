import { Component, HostBinding, ChangeDetectionStrategy } from '@angular/core';
@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AuthPageComponent {
  @HostBinding('class')
  private readonly classes =
    'flex justify-center items-center flex-col w-full h-full bg-charcoal gap-y-50';
}
