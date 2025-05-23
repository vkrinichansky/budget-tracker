import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  updateDoc,
  arrayUnion,
  doc,
  DocumentReference,
  deleteField,
} from '@angular/fire/firestore';
import {
  Category,
  CategoryValueChangeRecord,
  CategoriesResetRecord,
  CurrencyChangeRecord,
} from '@budget-tracker/models';

const CATEGORIES_PATH = 'categories';
const ACTIVITY_LOG_PATH = 'activityLog';
const ACCOUNTS_PATH = 'accounts';

@Injectable()
export class CategoriesApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  addCategory(category: Category): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${category.id}`]: category,
    });
  }

  async removeCategory(categoryId: string): Promise<void> {
    await updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${categoryId}`]: deleteField(),
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

  updateCategoriesAfterCurrencyChange(
    categories: Category[],
    activityLogRecord: CurrencyChangeRecord
  ): Promise<void> {
    const updatedCategoriesDictionary = categories.reduce(
      (result, category) => ({
        ...result,
        [`${CATEGORIES_PATH}.${category.id}.value`]: category.value,
      }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
      [`${ACTIVITY_LOG_PATH}`]: arrayUnion(activityLogRecord),
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'dashboard'), this.afAuth.currentUser?.uid);
  }
}
