import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryModalData, CategoryValueModalData } from '../../models';
import { BudgetType } from '@budget-tracker/data';
import { AddCategoryModalComponent, CategoryValueModalComponent } from '../../components';

@Injectable()
export class CategoryModalsService {
  constructor(private dialog: MatDialog) {}

  openAddIncomeCategoryModal() {
    const data: AddCategoryModalData = {
      budgetType: BudgetType.Income,
    };

    this.dialog.open(AddCategoryModalComponent, { data });
  }

  openAddExpenseCategoryModal() {
    const data: AddCategoryModalData = {
      budgetType: BudgetType.Expense,
    };

    this.dialog.open(AddCategoryModalComponent, { data });
  }

  openCategoryValueModal(categoryId: string) {
    const data: CategoryValueModalData = {
      categoryId,
    };

    this.dialog.open(CategoryValueModalComponent, { data });
  }
}
