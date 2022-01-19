import { OrganisationComponent } from './organisation/organisation.component';

import { UpdatePbaNumbersComponent } from './update-pba-numbers/update-pba-numbers.component';
import { UpdatePbaNumbersCheckComponent } from './update-pba-check/update-pba-numbers-check.component';

export const containers: any[] = [
    OrganisationComponent,
    UpdatePbaNumbersComponent,
    UpdatePbaNumbersCheckComponent
];

export * from './organisation/organisation.component';
export * from './update-pba-numbers/update-pba-numbers.component';
export * from './update-pba-check/update-pba-numbers-check.component';
