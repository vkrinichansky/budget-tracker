import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryModalData, CategoryValueModalData } from '../../models';
import { BudgetType } from '@budget-tracker/shared-models';
import { AddCategoryModalComponent, CategoryValueModalComponent } from '../../components';

@Injectable()
export class CategoryModalService {
  constructor(private dialog: MatDialog) {}

  openAddCategoryModal(budgetType: BudgetType) {
    const data: AddCategoryModalData = {
      budgetType: budgetType,
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
