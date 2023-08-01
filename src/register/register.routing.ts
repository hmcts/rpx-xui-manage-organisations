import { ModuleWithProviders } from '@angular/core';
// routes
import { RouterModule, Routes } from '@angular/router';
import { BeforeYouStartComponent } from '../register-org/components/before-you-start/before-you-start.component';
import { CompanyHouseDetailsComponent } from '../register-org/components/company-house-details/company-house-details.component';
import { DocumentExchangeReferenceDetailsComponent } from '../register-org/components/document-exchange-reference-details/document-exchange-reference-details.component';
import { DocumentExchangeReferenceComponent } from '../register-org/components/document-exchange-reference/document-exchange-reference.component';
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
  }
];

export const registerRouting: ModuleWithProviders<RegisterModule> = RouterModule.forChild(ROUTES);
