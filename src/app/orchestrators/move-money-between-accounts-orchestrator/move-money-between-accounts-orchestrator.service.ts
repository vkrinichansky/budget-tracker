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
import {
  BatchOperationService,
  DomainEvent,
  EventBusService,
  pick,
} from '@budget-tracker/shared-utils';
import { firstValueFrom } from 'rxjs';
import { BaseOrchestratorService } from '@budget-tracker/orchestrators-utils';

@Injectable()
export class MoveMoneyBetweenAccountsOrchestratorService extends BaseOrchestratorService {
  constructor(
    private readonly accountFacade: AccountFacadeService,
    private readonly activityLogFacade: ActivityLogFacadeService,
    eventBusService: EventBusService,
    batchOperationService: BatchOperationService
  ) {
    super(eventBusService, batchOperationService);
  }

  listen(): void {
    this.handleEvent<MoveMoneyBetweenAccountsEvent>(
      AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_START
    );
  }

  protected async eventCallback(event: DomainEvent<MoveMoneyBetweenAccountsEvent>): Promise<void> {
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

      this.eventBusService.emit({
        type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH,
        status: 'success',
      });
    } catch {
      this.eventBusService.emit({
        type: AccountEvents.MOVE_MONEY_BETWEEN_ACCOUNTS_FINISH,
        status: 'error',
        errorCode: 'errors.account.moveMoneyBetweenAccountsFlowFailed',
      });
    }
  }
}
