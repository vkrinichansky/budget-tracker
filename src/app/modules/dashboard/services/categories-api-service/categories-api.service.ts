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
import { Category } from '@budget-tracker/models';

const CATEGORIES_PATH = 'categories';
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
    updatedAccountValue: number
  ): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${CATEGORIES_PATH}.${updatedCategoryId}.value`]: updatedCategoryValue,
      [`${ACCOUNTS_PATH}.${updatedAccountId}.value`]: updatedAccountValue,
    });
  }

  resetCategories(categoriesIdsToReset: string[]): Promise<void> {
    const updatedCategoriesDictionary = categoriesIdsToReset.reduce(
      (result, categoryId) => ({ ...result, [`${CATEGORIES_PATH}.${categoryId}.value`]: 0 }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
    });
  }

  resetCategoriesAndActivityLog(categoriesIdsToReset: string[]): Promise<void> {
    const updatedCategoriesDictionary = categoriesIdsToReset.reduce(
      (result, categoryId) => ({ ...result, [`${CATEGORIES_PATH}.${categoryId}.value`]: 0 }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
    });
  }

  updateCategoriesAfterCurrencyChange(categories: Category[]): Promise<void> {
    const updatedCategoriesDictionary = categories.reduce(
      (result, category) => ({
        ...result,
        [`${CATEGORIES_PATH}.${category.id}.value`]: category.value,
      }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, CATEGORIES_PATH), this.afAuth.currentUser?.uid);
  }
}
