import { Injectable } from '@angular/core';
import {
  CollectionReference,
  DocumentData,
  Firestore,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from '@angular/fire/firestore';
import { BudgetTrackerService } from '@budget-tracker/budget-tracker';
import {
  Category,
  CategoryManagementRecord,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
} from '@budget-tracker/shared';

@Injectable()
export class CategoriesService {
  dataCollection: CollectionReference<DocumentData>;

  constructor(private firestore: Firestore, private btService: BudgetTrackerService) {
    this.dataCollection = collection(this.firestore, 'userData');
  }

  addCategory(category: Category, activityLogRecord: CategoryManagementRecord): Promise<void> {
    return updateDoc(this.btService.getDocRef(), {
      [`budget.categories.${category.budgetType}`]: arrayUnion(category),
      ['budget.activityLog']: arrayUnion(activityLogRecord),
    });
  }

  removeCategory(category: Category, activityLogRecord: CategoryManagementRecord): Promise<void> {
    return updateDoc(this.btService.getDocRef(), {
      [`budget.categories.${category.budgetType}`]: arrayRemove(category),
      ['budget.activityLog']: arrayUnion(activityLogRecord),
    });
  }

  changeCategoryValue(
    updatedCategoryArray: Category[],
    newBalanceValue: number,
    activityLogRecord: CategoryValueChangeRecord
  ): Promise<void> {
    const budgetType = updatedCategoryArray[0].budgetType;

    return updateDoc(this.btService.getDocRef(), {
      [`budget.categories.${budgetType}`]: updatedCategoryArray,
      ['budget.rootValues.balance']: newBalanceValue,
      ['budget.activityLog']: arrayUnion(activityLogRecord),
    });
  }

  resetCategories(updatedCategories: Category[], activityLogRecord: CategoriesResetRecord): Promise<void> {
    const budgetType = updatedCategories[0].budgetType;

    return updateDoc(this.btService.getDocRef(), {
      [`budget.categories.${budgetType}`]: updatedCategories,
      ['budget.activityLog']: arrayUnion(activityLogRecord),
    });
  }
}
