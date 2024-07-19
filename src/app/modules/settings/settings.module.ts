import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { RouterModule, Routes } from '@angular/router';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';
import { InfoCardOrderItemComponent, InfoCardsOrderSectionComponent } from './components';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
  },
];

@NgModule({
  declarations: [SettingsComponent, InfoCardsOrderSectionComponent, InfoCardOrderItemComponent],
  imports: [CommonModule, RouterModule.forChild(routes), DesignSystemModule, TranslateModule],
})
export class SettingsModule {}
