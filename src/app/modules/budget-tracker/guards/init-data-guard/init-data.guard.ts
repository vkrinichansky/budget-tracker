import { Injectable } from '@angular/core';

import { BudgetTrackerFacadeService } from '../../services';

@Injectable()
export class InitDataGuard  {
  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  async canActivate(): Promise<boolean> {
    this.budgetTrackerFacade.initData();
    return true;
  }
}
