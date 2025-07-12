import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { authReducer, AuthEffects, featureKey } from './store';
import { StoreModule } from '@ngrx/store';
import { AuthFacadeService, AuthService } from './services';
import { EffectsModule } from '@ngrx/effects';
import { AuthGuard, SecureInnerPagesGuard } from './guards';
import { UtilsModule } from '@budget-tracker/utils';
import { LoginButtonComponent } from './components';
@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    StoreModule.forFeature(featureKey, authReducer),
    EffectsModule.forFeature([AuthEffects]),
    UtilsModule,
  ],
  declarations: [LoginButtonComponent],
  exports: [LoginButtonComponent],
  providers: [AuthService, AuthFacadeService, AuthGuard, SecureInnerPagesGuard],
})
export class AuthDomainModule {}
