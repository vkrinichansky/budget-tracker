import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationBarComponent } from './components/navigation-bar/navigation-bar.component';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { AuthCoreModule } from '@budget-tracker/auth';
import { NavigationBarItemComponent } from './components/navigation-bar-item/navigation-bar-item.component';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [NavigationBarComponent, NavigationBarItemComponent],
  imports: [CommonModule, DesignSystemModule, AuthCoreModule, RouterModule, MatTooltipModule, TranslateModule],
  exports: [NavigationBarComponent],
})
export class NavigationBarModule {}
