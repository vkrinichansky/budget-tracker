import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { BehaviorSubject, tap } from 'rxjs';
import { SnackbarHandlerService } from '@budget-tracker/design-system';
import { ActionListenerService } from '@budget-tracker/utils';
import { AccountFacadeService } from '../../services';
import { Account } from '../../models';
import { AccountActions } from '../../store';

@Component({
  selector: 'app-accounts-list-modal',
  templateUrl: './accounts-list-modal.component.html',
  styleUrl: './accounts-list-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class AccountsListModalComponent implements OnInit {
  readonly accounts$ = new BehaviorSubject<Account[]>([]);
  readonly changeOrderInProgress$ = new BehaviorSubject<boolean>(false);

  constructor(
    private readonly accountFacade: AccountFacadeService,
    private readonly dialogRef: MatDialogRef<AccountsListModalComponent>,
    private readonly destroyRef: DestroyRef,
    private readonly actionListener: ActionListenerService,
    private readonly snackbarHandler: SnackbarHandlerService
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  async orderChanged(event: CdkDragDrop<Account[]>) {
    const resultArray = structuredClone(this.accounts$.value);

    moveItemInArray(resultArray, event.previousIndex, event.currentIndex);

    this.accounts$.next(resultArray);

    const updatedAccountsOrder: Record<string, number> = resultArray.reduce(
      (result, account, index) => ({ ...result, [account.id]: index }),
      {} as Record<string, number>
    );

    this.changeOrderInProgress$.next(true);

    try {
      this.accountFacade.bulkAccountChangeOrder(updatedAccountsOrder);

      await this.actionListener.waitForResult(
        AccountActions.bulkAccountOrderChanged,
        AccountActions.bulkAccountChangeOrderFail
      );

      this.snackbarHandler.showAccountOrderChangedSnackbar();
    } catch {
      this.snackbarHandler.showGeneralErrorSnackbar();
    } finally {
      this.changeOrderInProgress$.next(false);
    }
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  private initListeners(): void {
    this.accountFacade
      .getAllAccounts()
      .pipe(
        tap((accounts) => {
          if (!accounts.length) {
            this.closeModal();
          }
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((accounts) => this.accounts$.next(accounts));
  }
}
