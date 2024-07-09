import { Injectable } from '@angular/core';
import { DataInitFacadeService } from '@budget-tracker/data';

@Injectable({
  providedIn: 'root',
})
export class InitDataGuard {
  constructor(private dataInitFacade: DataInitFacadeService) {}

  async canActivate(): Promise<boolean> {
    await this.dataInitFacade.initData();
    return true;
  }
}
