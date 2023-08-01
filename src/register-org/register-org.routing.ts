import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeYouStartComponent } from './components/before-you-start/before-you-start.component';
import { CompanyHouseDetailsComponent } from './components/company-house-details/company-house-details.component';
import { DocumentExchangeReferenceDetailsComponent } from './components/document-exchange-reference-details/document-exchange-reference-details.component';
import { DocumentExchangeReferenceComponent } from './components/document-exchange-reference/document-exchange-reference.component';
import { RegisterOrgModule } from './register-org.module';

export const ROUTES: Routes = [
  {
    path: '',
    component: BeforeYouStartComponent
  },
  {
    path: 'before-you-start',
    component: BeforeYouStartComponent
  },
  {
    path: 'company-house-details',
    component: CompanyHouseDetailsComponent
  },
  {
    path: 'document-exchange-reference',
    component: DocumentExchangeReferenceComponent
  },
  {
    path: 'document-exchange-reference-details',
    component: DocumentExchangeReferenceDetailsComponent
  }
];

export const registerRouting: ModuleWithProviders<RegisterOrgModule> = RouterModule.forChild(ROUTES);
