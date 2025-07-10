import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  Firestore,
  collection,
  updateDoc,
  doc,
  DocumentReference,
  deleteField,
  getDoc,
} from '@angular/fire/firestore';
import { Category } from '@budget-tracker/models';

@Injectable()
export class CategoryApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  async loadCategories(): Promise<Record<string, Category>> {
    return getDoc(this.getDocRef()).then((doc): Record<string, Category> => doc.data());
  }

  addCategory(category: Category): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${category.id}`]: category,
    });
  }

  async removeCategory(categoryId: string): Promise<void> {
    await updateDoc(this.getDocRef(), {
      [`${categoryId}`]: deleteField(),
    });
  }

  changeCategoryValue(updatedCategoryId: string, updatedCategoryValue: number): Promise<void> {
    return updateDoc(this.getDocRef(), {
      [`${updatedCategoryId}.value`]: updatedCategoryValue,
    });
  }

  resetCategories(categoriesIdsToReset: string[]): Promise<void> {
    const updatedCategoriesDictionary = categoriesIdsToReset.reduce(
      (result, categoryId) => ({ ...result, [`${categoryId}.value`]: 0 }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
    });
  }

  resetCategoriesAndActivityLog(categoriesIdsToReset: string[]): Promise<void> {
    const updatedCategoriesDictionary = categoriesIdsToReset.reduce(
      (result, categoryId) => ({ ...result, [`${categoryId}.value`]: 0 }),
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
        [`${category.id}.value`]: category.value,
      }),
      {}
    );

    return updateDoc(this.getDocRef(), {
      ...updatedCategoriesDictionary,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'categories'), this.afAuth.currentUser?.uid);
  }
}
