import { Component, HostBinding, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { FirstLoginOrchestratorService } from '@budget-tracker/first-login-orchestrator';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AuthPageComponent implements OnInit, OnDestroy {
  @HostBinding('class')
  private readonly classes =
    'flex justify-center items-center flex-col w-full h-full bg-charcoal gap-y-50';

  constructor(private readonly firstLoginOrchestratorService: FirstLoginOrchestratorService) {}

  ngOnInit(): void {
    this.firstLoginOrchestratorService.listen();
  }

  ngOnDestroy(): void {
    this.firstLoginOrchestratorService.destroy();
  }
}
