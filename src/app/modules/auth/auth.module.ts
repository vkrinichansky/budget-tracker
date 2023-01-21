import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [AuthPageComponent],
  imports: [CommonModule, AuthRoutingModule, DesignSystemModule, TranslateModule],
})
export class AuthModule {}
