import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainPageRoutingModule } from './main-page-routing.module';
import { MainPageComponent } from './main-page.component';
import { DesignSystemModule } from '@budget-tracker/design-system';

@NgModule({
  declarations: [MainPageComponent],
  imports: [CommonModule, MainPageRoutingModule, DesignSystemModule],
})
export class MainPageModule {}
