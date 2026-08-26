import { ModuleWithProviders } from '@angular/core';
// routes
import { RouterModule, Routes } from '@angular/router';
import { SubmittedConfirmationComponent } from './components/submitted-confirmation/submitted-confirmation.component';
import { RegisterComponent } from './containers';
import { RegisterModule } from './register.module';

export const ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'register/:pageId',
    component: RegisterComponent
    // canActivate: [HealthCheckGuard]
  },
  {
    path: 'confirmation',
    component: SubmittedConfirmationComponent
    // canActivate: [HealthCheckGuard]
  }
];

export const registerRouting: ModuleWithProviders<RegisterModule> = RouterModule.forChild(ROUTES);
