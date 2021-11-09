import { SubmittedConfirmationComponent } from './components/submitted-confirmation/submitted-confirmation.component';
// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {RegisterComponent} from './containers';

export const ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register - Register organisation'
    }
  },
  {
    path: 'register/:pageId',
    component: RegisterComponent,
    data: {
      title: 'Register - Register organisation'
    }
    // canActivate: [HealthCheckGuard] // TODO decide do we need this
  },
  {
    path: 'confirmation',
    component: SubmittedConfirmationComponent,
    data: {
      title: 'Confirmation - Register organisation'
    }
    // canActivate: [HealthCheckGuard]
  }
];

export const registerRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
