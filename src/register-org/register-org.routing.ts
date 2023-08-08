import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeYouStartComponent } from './components/before-you-start/before-you-start.component';
import { CompanyHouseDetailsComponent } from './components/company-house-details/company-house-details.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { DocumentExchangeReferenceDetailsComponent } from './components/document-exchange-reference-details/document-exchange-reference-details.component';
import { DocumentExchangeReferenceComponent } from './components/document-exchange-reference/document-exchange-reference.component';
import { OfficeAddressesComponent } from './components/office-addresses/office-addresses.component';
import { OrganisationTypeComponent } from './components/organisation-type/organisation-type.component';
import { RegisteredWithRegulatorComponent } from './components/registered-with-regulator/registered-with-regulator.component';
import { RegisterOrgModule } from './register-org.module';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'before-you-start',
    pathMatch: 'full'
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
    path: 'organisation-type',
    component: OrganisationTypeComponent
  },
  {
    path: 'document-exchange-reference',
    component: DocumentExchangeReferenceComponent
  },
  {
    path: 'document-exchange-reference-details',
    component: DocumentExchangeReferenceDetailsComponent
  },
  {
    path: 'office-addresses',
    component: OfficeAddressesComponent
  },
  {
    path: 'registered-with-regulator',
    component: RegisteredWithRegulatorComponent
  },
  {
    path: 'contact-details',
    component: ContactDetailsComponent
  }
];

export const registerRouting: ModuleWithProviders<RegisterOrgModule> = RouterModule.forChild(ROUTES);
