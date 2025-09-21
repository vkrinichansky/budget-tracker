import { Injectable } from '@angular/core';
import { collection, doc, Firestore, getDoc } from '@angular/fire/firestore';
import { Snapshots } from '@budget-tracker/shared-models';
import { firstValueFrom, switchMap, from, map } from 'rxjs';

@Injectable()
export class StatisticsInitApiService {
  constructor(private firestore: Firestore) {}

  async initData(): Promise<Snapshots> {
    return {} as Snapshots;
  }
}
