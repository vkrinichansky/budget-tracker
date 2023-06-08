import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { BudgetTrackerFacadeService } from '../../modules';

@Injectable()
export class InitDataGuard implements CanActivate {
  constructor(private budgetTrackerFacade: BudgetTrackerFacadeService) {}

  async canActivate(): Promise<boolean> {
    this.budgetTrackerFacade.initData();
    return true;
  }
}
