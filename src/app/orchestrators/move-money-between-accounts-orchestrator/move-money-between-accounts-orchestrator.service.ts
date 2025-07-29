import { Injectable } from '@angular/core';
import {
  AccountEvents,
  AccountFacadeService,
  MoveMoneyBetweenAccountsEvent,
} from '@budget-tracker/account';
import {
  ActivityLogFacadeService,
  MoveMoneyBetweenAccountsRecord,
  createMoveMoneyBetweenAccountsRecord,
} from '@budget-tracker/activity-log';
import { EventBusService, getErrorMessage, pick } from '@budget-tracker/utils';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

@Injectable()
export class MoveMoneyBetweenAccountsOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly accountFacade: AccountFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly eventBus: EventBusService
  ) {}

  listen(): void {
    this.eventBus
      .on<MoveMoneyBetweenAccountsEvent>(AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          await this.accountFacade.moveMoneyBetweenAccount(
            event.payload.fromAccountId,
            event.payload.toAccountId,
            event.payload.valueToMove,
            event.payload.convertedValueToMove
          );

          const fromAccount = await firstValueFrom(
            this.accountFacade.getAccountById(event.payload.fromAccountId)
          );

          const toAccount = await firstValueFrom(
            this.accountFacade.getAccountById(event.payload.toAccountId)
          );

          const moveMoneyBetweenAccountsRecord: MoveMoneyBetweenAccountsRecord =
            createMoveMoneyBetweenAccountsRecord(
              pick(fromAccount, ['id', 'name', 'currency']),
              pick(toAccount, ['id', 'name', 'currency']),
              event.payload.valueToMove,
              event.payload.convertedValueToMove
            );

          await this.activityLogFacade.addRecord(moveMoneyBetweenAccountsRecord);

          this.eventBus.emit({
            type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH,
            status: 'success',
          });
        } catch (error) {
          this.eventBus.emit({
            type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH,
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
