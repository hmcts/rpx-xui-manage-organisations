import { OrganisationComponent } from './organisation/organisation.component';
import { UpdatePbaNumbersCheckComponent } from './update-pba-check/update-pba-numbers-check.component';
import { UpdatePbaNumbersComponent } from './update-pba-numbers/update-pba-numbers.component';
import { UpdateAddressComponent } from './update-address/update-address.component';
import { UpdateAddressDocumentExchangeComponent } from './update-address-document-exchange/update-address-document-exchange.component';
import { UpdateAddressDocumentExchangeDetailsComponent } from './update-address-document-exchange-details/update-address-document-exchange-details.component';
import { UpdateAddressCheckComponent } from './update-address-check/update-address-check.component';

export const containers: any[] = [
  OrganisationComponent,
  UpdatePbaNumbersComponent,
  UpdatePbaNumbersCheckComponent,
  UpdateAddressComponent,
  UpdateAddressDocumentExchangeComponent,
  UpdateAddressDocumentExchangeDetailsComponent,
  UpdateAddressCheckComponent
];

export * from './organisation/organisation.component';
export * from './update-pba-numbers/update-pba-numbers.component';
export * from './update-pba-check/update-pba-numbers-check.component';
export * from './update-address/update-address.component';
export * from './update-address-document-exchange/update-address-document-exchange.component';
export * from './update-address-document-exchange-details/update-address-document-exchange-details.component';
export * from './update-address-check/update-address-check.component';
