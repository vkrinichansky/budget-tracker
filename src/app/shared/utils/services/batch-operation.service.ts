import { Injectable } from '@angular/core';
import { Firestore, writeBatch, DocumentReference } from '@angular/fire/firestore';

export interface BatchOperation {
  docRef: DocumentReference;
  type: 'update' | 'set' | 'delete';
  data: unknown;
}

@Injectable({ providedIn: 'root' })
export class BatchOperationService {
  constructor(private firestore: Firestore) {}

  async executeBatchOperation(operations: BatchOperation[]): Promise<void> {
    const batch = writeBatch(this.firestore);

    operations.forEach((operation) => {
      switch (operation.type) {
        case 'update':
          batch.update(operation.docRef, operation.data);
          break;
        case 'set':
          batch.set(operation.docRef, operation.data);
          break;
        case 'delete':
          batch.delete(operation.docRef);
          break;
      }
    });

    await batch.commit();
  }
}
