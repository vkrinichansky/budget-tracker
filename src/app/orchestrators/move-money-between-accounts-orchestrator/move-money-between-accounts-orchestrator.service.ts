import { Injectable } from '@angular/core';
import {
  AccountEvents,
  AccountFacadeService,
  MoveMoneyBetweenAccountsEvent,
  Account,
} from '@budget-tracker/account';
import {
  ActivityLogFacadeService,
  MoveMoneyBetweenAccountsRecord,
  createMoveMoneyBetweenAccountsRecord,
} from '@budget-tracker/activity-log';
import { BatchOperationService, EventBusService, pick } from '@budget-tracker/utils';
import { firstValueFrom, Subject, takeUntil } from 'rxjs';

@Injectable()
export class MoveMoneyBetweenAccountsOrchestratorService {
  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly accountFacade: AccountFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    private readonly eventBus: EventBusService,
    private readonly batchOperationService: BatchOperationService
  ) {}

  listen(): void {
    this.eventBus
      .on<MoveMoneyBetweenAccountsEvent>(AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_START)
      .pipe(takeUntil(this.destroy$))
      .subscribe(async (event) => {
        try {
          const fromAccount = await firstValueFrom(
            this.accountFacade.getAccountById(event.payload.fromAccountId)
          );

          const toAccount = await firstValueFrom(
            this.accountFacade.getAccountById(event.payload.toAccountId)
          );

          const fromAccountNewValue = fromAccount.value - event.payload.valueToMove;
          const toAccountNewValue = toAccount.value + event.payload.convertedValueToMove;

          const moveMoneyBetweenAccountsRecord: MoveMoneyBetweenAccountsRecord =
            createMoveMoneyBetweenAccountsRecord(
              pick(fromAccount, ['id', 'name', 'currency']),
              pick(toAccount, ['id', 'name', 'currency']),
              event.payload.valueToMove,
              event.payload.convertedValueToMove
            );

          await this.batchOperationService.executeBatchOperation([
            {
              docRef: this.accountFacade.getAccountDocRef(),
              type: 'update',
              data: {
                [`${fromAccount.id}.value`]: fromAccountNewValue,
                [`${toAccount.id}.value`]: toAccountNewValue,
              },
            },
            {
              docRef: this.activityLogFacade.getActivityLogDocRef(),
              type: 'update',
              data: { [moveMoneyBetweenAccountsRecord.id]: moveMoneyBetweenAccountsRecord },
            },
          ]);

          this.accountFacade.updateAccounts([
            {
              id: fromAccount.id,
              value: fromAccountNewValue,
            } as Account,
            {
              id: toAccount.id,
              value: toAccountNewValue,
            } as Account,
          ]);

          this.activityLogFacade.addRecord(moveMoneyBetweenAccountsRecord);

          this.eventBus.emit({
            type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH,
            status: 'success',
          });
        } catch {
          this.eventBus.emit({
            type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH,
            status: 'error',
            errorCode: 'errors.account.moveMoneyBetweenAccountsFlowFailed',
          });
        }
      });
  }

  destroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
