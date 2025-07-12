import { Injectable } from '@angular/core';
import { EventBusService, getErrorMessage, NavigatorService } from '@budget-tracker/utils';
import { AuthEvents, AuthFacadeService } from '@budget-tracker/auth';
import { MetadataFacadeService } from '@budget-tracker/metadata';
import { firstValueFrom, map, Subject, takeUntil } from 'rxjs';
import { AccountFacadeService } from '@budget-tracker/account';
import { CategoryFacadeService } from '@budget-tracker/category';
import { ActivityLogFacadeService } from '@budget-tracker/activity-log';

@Injectable()
export class FirstLoginOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly eventBus: EventBusService,
    private readonly authFacade: AuthFacadeService,
    private readonly metadataFacade: MetadataFacadeService,
    private readonly accountFacade: AccountFacadeService,
    private readonly categoryFacade: CategoryFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly navigator: NavigatorService
  ) {}

  listen(): void {
    this.eventBus
      .on(AuthEvents.LOGIN_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async () => {
        try {
          await this.authFacade.googleLogin();

          const isNewUser = await firstValueFrom(
            this.authFacade.getUser().pipe(map((user) => user?.isNewUser))
          );

          if (isNewUser) {
            await this.metadataFacade.initMetadataDB();
            await this.accountFacade.initAccountDB();
            await this.categoryFacade.initCategoryDB();
            await this.activityLogFacade.initActivityLogDB();
          }

          this.navigator.navigateToDashboard();

          this.eventBus.emit({
            type: AuthEvents.LOGIN_FINISH,
            status: 'success',
          });
        } catch (error) {
          this.eventBus.emit({
            type: AuthEvents.LOGIN_FINISH,
            status: 'error',
            errorCode: getErrorMessage(error),
          });
        }
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
