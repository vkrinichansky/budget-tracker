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
  setDoc,
} from '@angular/fire/firestore';
import { Category, expenseAdjustmentCategory, incomeAdjustmentCategory } from '../../models';

@Injectable()
export class CategoryApiService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  async loadCategories(): Promise<Record<string, Category>> {
    const doc = await getDoc(this.getDocRef());

    if (doc.exists()) {
      return doc.data() as Record<string, Category>;
    }

    await setDoc(this.getDocRef(), {
      [incomeAdjustmentCategory.id]: incomeAdjustmentCategory,
      [expenseAdjustmentCategory.id]: expenseAdjustmentCategory,
    });
    return {
      [incomeAdjustmentCategory.id]: incomeAdjustmentCategory,
      [expenseAdjustmentCategory.id]: expenseAdjustmentCategory,
    };
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

  getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'categories'), this.afAuth.currentUser?.uid);
  }
}
