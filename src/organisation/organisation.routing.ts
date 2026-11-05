// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrganisationGuard } from '../organisation/guards/organisation.guard';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { UserRoleGuard } from '../shared/guards/user-role.guard';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import {
  OrganisationComponent,
  UpdateAddressCheckComponent,
  UpdateAddressComponent,
  UpdateAddressDocumentExchangeComponent,
  UpdateAddressDocumentExchangeDetailsComponent
} from './containers';
import { UpdatePbaNumbersCheckComponent } from './containers/update-pba-check/update-pba-numbers-check.component';
import { UpdatePbaNumbersComponent } from './containers/update-pba-numbers/update-pba-numbers.component';
import { OrganisationModule } from './organisation.module';
import { AddressUpdateGuard } from './guards/address-update.guard';

export const ROUTES: Routes = [
  {
    path: 'organisation',
    component: OrganisationComponent,
    canActivate: [
      AuthGuard,
      OrganisationGuard,
      HealthCheckGuard
    ]
  },
  {
    path: 'organisation/update-address',
    canActivate: [
      AuthGuard,
      AddressUpdateGuard,
      HealthCheckGuard
    ],
    children: [
      {
        path: '',
        component: UpdateAddressComponent
      },
      {
        path: 'document-exchange-reference',
        component: UpdateAddressDocumentExchangeComponent
      },
      {
        path: 'document-exchange-reference-details',
        component: UpdateAddressDocumentExchangeDetailsComponent
      },
      {
        path: 'check',
        component: UpdateAddressCheckComponent
      }
    ]
  },
  {
    path: 'organisation/update-pba-numbers',
    component: UpdatePbaNumbersComponent,
    data: { role: 'pui-finance-manager' },
    canActivate: [
      OrganisationGuard,
      UserRoleGuard
    ]
  },
  {
    path: 'organisation/update-pba-numbers-check',
    component: UpdatePbaNumbersCheckComponent,
    data: { role: 'pui-finance-manager' },
    canActivate: [
      OrganisationGuard,
      UserRoleGuard
    ]
  }
];

export const organisationRouting: ModuleWithProviders<OrganisationModule> = RouterModule.forChild(ROUTES);
