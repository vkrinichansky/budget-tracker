import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryModalData } from '../../models';
import { BudgetType } from '@budget-tracker/shared';
import { AddCategoryModalComponent } from '../../components';

@Injectable()
export class AddCategoryModalService {
  constructor(private dialog: MatDialog) {}

  openAddIncomeCategoryModal() {
    const data: AddCategoryModalData = {
      budgetType: BudgetType.Income,
    };

    this.dialog.open(AddCategoryModalComponent, { data, disableClose: true });
  }

  openAddExpenseCategoryModal() {
    const data: AddCategoryModalData = {
      budgetType: BudgetType.Expense,
    };

    this.dialog.open(AddCategoryModalComponent, { data, disableClose: true });
  }
}
