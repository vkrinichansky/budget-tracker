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
  Account,
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
    category: Category,
    activityLogRecord: CategoryManagementRecord,
    recordsToRemove: CategoryValueChangeRecord[]
  ): Promise<void> {
    await updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${category.id}`]: deleteField(),
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
    return await updateDoc(this.getDocRef(), {
      [`${ACTIVITY_LOG_PATH}`]: arrayRemove(...recordsToRemove),
    });
  }

  changeCategoryValue(
    updatedCategory: Category,
    updatedAccount: Account,
    activityLogRecord: CategoryValueChangeRecord
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${updatedCategory.id}`]: updatedCategory,
      [`${ACCOUNTS_PATH}.${updatedAccount.id}`]: updatedAccount,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  resetCategories(updatedCategories: Category[], activityLogRecord: CategoriesResetRecord): Promise<void> {
    const updatedCategoriesDictionary = updatedCategories.reduce(
      (result, category) => ({ ...result, [`${CATEGORIES_PATH}.${category.id}`]: category }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userData'), this.afAuth.currentUser?.uid);
  }
}
