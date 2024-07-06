import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { collection, doc, DocumentReference, Firestore, updateDoc } from '@angular/fire/firestore';
import { CurrenciesEnum, LanguagesEnum } from '@budget-tracker/utils';

@Injectable()
export class MetadataService {
  constructor(
    private firestore: Firestore,
    private afAuth: Auth
  ) {}

  changeCurrency(newCurrency: CurrenciesEnum): Promise<void> {
    return updateDoc(this.getDocRef(), {
      currency: newCurrency,
    });
  }

  changeLanguage(newLanguage: LanguagesEnum): Promise<void> {
    return updateDoc(this.getDocRef(), {
      language: newLanguage,
    });
  }

  private getDocRef(): DocumentReference {
    return doc(collection(this.firestore, 'userMetadata'), this.afAuth.currentUser?.uid);
  }
}
