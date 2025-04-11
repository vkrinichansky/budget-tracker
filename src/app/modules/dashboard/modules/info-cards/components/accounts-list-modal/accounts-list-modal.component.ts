import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatDialogRef } from '@angular/material/dialog';
import { AccountsFacadeService } from '@budget-tracker/data';
import { Account } from '@budget-tracker/models';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Component({
  selector: 'app-accounts-list-modal',
  templateUrl: './accounts-list-modal.component.html',
  styleUrl: './accounts-list-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsListModalComponent implements OnInit {
  readonly accounts$ = new BehaviorSubject<Account[]>([]);

  changeOrderInProgress$: Observable<boolean>;

  constructor(
    private accountsFacade: AccountsFacadeService,
    private dialogRef: MatDialogRef<AccountsListModalComponent>,
    private destroyRef: DestroyRef
  ) {}

  ngOnInit(): void {
    this.initListeners();
  }

  orderChanged(event: CdkDragDrop<Account[]>) {
    const resultArray = structuredClone(this.accounts$.value);

    moveItemInArray(resultArray, event.previousIndex, event.currentIndex);

    this.accounts$.next(resultArray);

    const updatedAccountsOrder: Record<string, number> = resultArray.reduce(
      (result, account, index) => ({ ...result, [account.id]: index }),
      {} as Record<string, number>
    );

    this.accountsFacade.bulkAccountChangeOrder(updatedAccountsOrder);
  }

  closeModal(): void {
    this.dialogRef.close();
  }

  private initListeners(): void {
    this.accountsFacade
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

    this.changeOrderInProgress$ = this.accountsFacade.getOrderChangingInProgress();
  }
}
