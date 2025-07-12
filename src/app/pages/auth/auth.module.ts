import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthPageComponent } from './components';
import { DesignSystemModule } from '@budget-tracker/design-system';
import { RouterModule, Routes } from '@angular/router';
import { AuthDomainModule } from '@budget-tracker/auth';
import { FirstLoginOrchestratorModule } from '@budget-tracker/first-login-orchestrator';

const routes: Routes = [
  {
    path: '',
    component: AuthPageComponent,
  },
  {
    path: '**',
    component: AuthPageComponent,
  },
];

@NgModule({
  imports: [
    CommonModule,
    DesignSystemModule,
    RouterModule.forChild(routes),
    AuthDomainModule,
    FirstLoginOrchestratorModule,
  ],
  declarations: [AuthPageComponent],
})
export class AuthPageModule {}
