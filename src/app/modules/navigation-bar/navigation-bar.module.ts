import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { AuthCoreModule } from '@budget-tracker/auth';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DataModule } from '@budget-tracker/data';
import { NavigationBarComponent, NavigationBarItemComponent } from './components';

@NgModule({
  declarations: [NavigationBarComponent, NavigationBarItemComponent],
  imports: [
    CommonModule,
    DesignSystemModule,
    AuthCoreModule,
    RouterModule,
    TranslateModule,
    DataModule,
  ],
  exports: [NavigationBarComponent],
})
export class NavigationBarModule {}
