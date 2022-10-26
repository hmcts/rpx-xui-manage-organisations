import {ModuleWithProviders} from '@angular/core';
// routes
import {RouterModule, Routes} from '@angular/router';
import { SubmittedConfirmationComponent } from './components/submitted-confirmation/submitted-confirmation.component';
import {RegisterComponent} from './containers';

export const ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register/:pageId',
    component: RegisterComponent,
    // canActivate: [HealthCheckGuard] // TODO decide do we need this
  },
  {
    path: 'confirmation',
    component: SubmittedConfirmationComponent,
    // canActivate: [HealthCheckGuard]
  }
];

export const registerRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
