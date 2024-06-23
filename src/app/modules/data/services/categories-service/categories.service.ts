import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  updateDoc,
  arrayUnion,
  arrayRemove,
  doc,
  DocumentReference,
} from '@angular/fire/firestore';
import {
  Category,
  CategoryManagementRecord,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
  BudgetTrackerState,
  BudgetType,
} from '../../models';

const CATEGORIES_PATH = 'budget.categories';
const ACTIVITY_LOG_PATH = 'budget.activityLog';
const ROOT_VALUES_PATH = 'budget.rootValues';
const RESET_DATE_PATH = 'budget.resetDate';

@Injectable()
export class CategoriesService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  addCategory(category: Category, activityLogRecord: CategoryManagementRecord): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${category.budgetType}`]: arrayUnion(category),
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  removeCategory(category: Category, activityLogRecord: CategoryManagementRecord): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${category.budgetType}`]: arrayRemove(category),
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  changeCategoryValue(
    updatedCategoryArray: Category[],
    newBalanceValue: number,
    activityLogRecord: CategoryValueChangeRecord
  ): Promise<void> {
    const budgetType = updatedCategoryArray[0].budgetType;

    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${budgetType}`]: updatedCategoryArray,
      [`${ROOT_VALUES_PATH}.balance`]: newBalanceValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  resetCategories(updatedCategories: Category[], activityLogRecord: CategoriesResetRecord): Promise<void> {
    const budgetType = updatedCategories[0].budgetType;

    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${budgetType}`]: updatedCategories,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  resetData(data: BudgetTrackerState, activityLogRecords: CategoriesResetRecord[]): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${BudgetType.Income}`]: data.budget.categories.income,
      [`${CATEGORIES_PATH}.${BudgetType.Expense}`]: data.budget.categories.expense,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(...activityLogRecords),
      [`${RESET_DATE_PATH}`]: data.budget.resetDate,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
