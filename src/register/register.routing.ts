import { ModuleWithProviders } from '@angular/core';
// routes
import { RouterModule, Routes } from '@angular/router';
import { OrganisationTypeComponent } from './components/organisation-type/organisation-type.component';
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
    // canActivate: [HealthCheckGuard] // TODO decide do we need this
  },
  {
    path: 'confirmation',
    component: SubmittedConfirmationComponent
    // canActivate: [HealthCheckGuard]
  },
  {
    path: 'organisation-type',
    component: OrganisationTypeComponent
  }
];

export const registerRouting: ModuleWithProviders<RegisterModule> = RouterModule.forChild(ROUTES);
