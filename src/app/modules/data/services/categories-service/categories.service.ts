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
  deleteField,
} from '@angular/fire/firestore';
import {
  Category,
  CategoryManagementRecord,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
} from '../../models';

const CATEGORIES_PATH = 'budget.categories';
const ACTIVITY_LOG_PATH = 'budget.activityLog';
const ACCOUNTS_PATH = 'budget.accounts';

@Injectable()
export class CategoriesService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  addCategory(category: Category, activityLogRecord: CategoryManagementRecord): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${category.id}`]: category,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  async removeCategory(
    categoryId: string,
    activityLogRecord: CategoryManagementRecord,
    recordsToRemove: CategoryValueChangeRecord[]
  ): Promise<void> {
    await updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${categoryId}`]: deleteField(),
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });

    await updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(...recordsToRemove),
    });
  }

  changeCategoryValue(
    updatedCategoryId: string,
    updatedCategoryValue: number,
    updatedAccountId: string,
    updatedAccountValue: number,
    activityLogRecord: CategoryValueChangeRecord
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${updatedCategoryId}.value`]: updatedCategoryValue,
      [`${ACCOUNTS_PATH}.${updatedAccountId}.value`]: updatedAccountValue,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  resetCategories(
    categoriesIdsToReset: string[],
    activityLogRecord: CategoriesResetRecord
  ): Promise<void> {
    const updatedCategoriesDictionary = categoriesIdsToReset.reduce(
      (result, categoryId) => ({ ...result, [`${CATEGORIES_PATH}.${categoryId}.value`]: 0 }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  resetCategoriesAndActivityLog(categoriesIdsToReset: string[]): Promise<void> {
    const updatedCategoriesDictionary = categoriesIdsToReset.reduce(
      (result, categoryId) => ({ ...result, [`${CATEGORIES_PATH}.${categoryId}.value`]: 0 }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
      [`${ACTIVITY_LOG_PATH}`]: [],
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
