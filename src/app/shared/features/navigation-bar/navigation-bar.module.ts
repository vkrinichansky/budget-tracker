import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { AuthDomainModule } from '@budget-tracker/auth';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NavigationBarComponent, NavigationBarItemComponent } from './components';

@NgModule({
  declarations: [NavigationBarComponent, NavigationBarItemComponent],
  imports: [CommonModule, DesignSystemModule, AuthDomainModule, RouterModule, TranslateModule],
  exports: [NavigationBarComponent],
})
export class NavigationBarModule {}
