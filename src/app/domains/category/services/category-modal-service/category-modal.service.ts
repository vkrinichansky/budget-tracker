import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryModalData } from '../../models';
import { BudgetType } from '@budget-tracker/shared-models';
import { AddCategoryModalComponent } from '../../components';

@Injectable()
export class CategoryModalService {
  constructor(private dialog: MatDialog) {}

  openAddCategoryModal(budgetType: BudgetType) {
    const data: AddCategoryModalData = {
      budgetType: budgetType,
    };

    this.dialog.open(AddCategoryModalComponent, { data });
  }
}
