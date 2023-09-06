import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BeforeYouStartComponent } from './components/before-you-start/before-you-start.component';
import { CheckYourAnswersComponent } from './components/check-your-answers/check-your-answers.component';
import { CompanyHouseDetailsComponent } from './components/company-house-details/company-house-details.component';
import { ContactDetailsComponent } from './components/contact-details/contact-details.component';
import { DocumentExchangeReferenceDetailsComponent } from './components/document-exchange-reference-details/document-exchange-reference-details.component';
import { DocumentExchangeReferenceComponent } from './components/document-exchange-reference/document-exchange-reference.component';
import { OfficeAddressesComponent } from './components/office-addresses/office-addresses.component';
import { OrganisationServicesAccessComponent } from './components/organisation-services-access/organisation-services-access.component';
import { OrganisationTypeComponent } from './components/organisation-type/organisation-type.component';
import { PaymentByAccountDetailsComponent } from './components/payment-by-account-details/payment-by-account-details.component';
import { PaymentByAccountComponent } from './components/payment-by-account/payment-by-account.component';
import { RegisteredRegulatorComponent } from './components/registered-regulator/registered-regulator.component';
import { RegisteredWithRegulatorComponent } from './components/registered-with-regulator/registered-with-regulator.component';
import { RegistrationSubmittedComponent } from './components/registration-submitted/registration-submitted.component';
import { RegulatoryOrganisationTypeComponent } from './components/regulatory-organisation-type/regulatory-organisation-type.component';
import { RegisteredAddressComponent } from './containers';
import { RegisterOrgModule } from './register-org.module';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full'
  },
  {
    path: 'register',
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
    path: 'organisation-services-access',
    component: OrganisationServicesAccessComponent
  },
  {
    path: 'payment-by-account',
    component: PaymentByAccountComponent
  },
  {
    path: 'payment-by-account-details',
    component: PaymentByAccountDetailsComponent
  },
  {
    path: 'registered-address',
    component: RegisteredAddressComponent
  },
  {
    path: 'registered-regulator',
    component: RegisteredRegulatorComponent
  },
  {
    path: 'registered-with-regulator',
    component: RegisteredWithRegulatorComponent
  },
  {
    path: 'contact-details',
    component: ContactDetailsComponent
  },
  {
    path: 'registration-submitted',
    component: RegistrationSubmittedComponent
  },
  {
    path: 'check-your-answers/:optional',
    component: CheckYourAnswersComponent
  }
];

export const registerRouting: ModuleWithProviders<RegisterOrgModule> = RouterModule.forChild(ROUTES);
