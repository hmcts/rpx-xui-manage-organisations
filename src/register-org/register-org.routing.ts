import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeYouStartComponent } from './components/before-you-start/before-you-start.component';
import { CompanyHouseDetailsComponent } from './components/company-house-details/company-house-details.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { DocumentExchangeReferenceDetailsComponent } from './components/document-exchange-reference-details/document-exchange-reference-details.component';
import { DocumentExchangeReferenceComponent } from './components/document-exchange-reference/document-exchange-reference.component';
import { OfficeAddressesComponent } from './components/office-addresses/office-addresses.component';
import { OrganisationTypeComponent } from './components/organisation-type/organisation-type.component';
import { RegisterOrgModule } from './register-org.module';
import { RegulatoryOrganisationTypeComponent } from './components/regulatory-organisation-type/regulatory-organisation-type.component';

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
    path: 'regulatory-organisation-type',
    component: RegulatoryOrganisationTypeComponent
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
    path: 'contact-details',
    component: ContactDetailsComponent
  }
];

export const registerRouting: ModuleWithProviders<RegisterOrgModule> = RouterModule.forChild(ROUTES);
