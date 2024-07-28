import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { AuthPageComponent } from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { authFeature } from './store/reducers/auth.reducer';
import { StoreModule } from '@ngrx/store';
import { AuthFacadeService, AuthService } from './services';
import { EffectsModule } from '@ngrx/effects';
import { AuthEffects } from './store/effects';
import { AuthGuard, SecureInnerPagesGuard } from './guards';
import { UtilsModule } from '@budget-tracker/utils';

@NgModule({
  declarations: [AuthPageComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    DesignSystemModule,
    StoreModule.forFeature(authFeature),
    EffectsModule.forFeature([AuthEffects]),
    UtilsModule,
  ],
  providers: [AuthService, AuthFacadeService, AuthGuard, SecureInnerPagesGuard],
})
export class AuthCoreModule {}
