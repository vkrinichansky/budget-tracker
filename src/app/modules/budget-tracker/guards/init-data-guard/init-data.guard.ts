import { Injectable } from '@angular/core';
import { DataInitFacadeService } from '@budget-tracker/data';

@Injectable()
export class InitDataGuard {
  constructor(private dataInitFacade: DataInitFacadeService) {}

  async canActivate(): Promise<boolean> {
    this.dataInitFacade.initData();
    return true;
  }
}
