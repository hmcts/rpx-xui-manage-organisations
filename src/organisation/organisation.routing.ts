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
  UpdateAddressDocumentExchangeDetailsComponent,
  UpdateOrgNameCheckComponent,
  UpdateOrgNameComponent,
  UpdateSraCheckComponent,
  UpdateSraComponent
} from './containers';
import { UpdatePbaNumbersCheckComponent } from './containers/update-pba-check/update-pba-numbers-check.component';
import { UpdatePbaNumbersComponent } from './containers/update-pba-numbers/update-pba-numbers.component';
import { OrganisationModule } from './organisation.module';
import { AddressUpdateGuard } from './guards/address-update.guard';
import { AddressUpdateStepGuard } from './guards/address-update-step.guard';
import { OrganisationDetailsUpdateGuard } from './guards/organisation-details-update.guard';
import { OrganisationUpdateCheckGuard } from './guards/organisation-update-check.guard';

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
    data: { role: 'pui-organisation-manager' },
    canActivate: [
      AuthGuard,
      UserRoleGuard,
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
        component: UpdateAddressDocumentExchangeComponent,
        data: { addressUpdateStep: 'document-exchange-reference' },
        canActivate: [AddressUpdateStepGuard]
      },
      {
        path: 'document-exchange-reference-details',
        component: UpdateAddressDocumentExchangeDetailsComponent,
        data: { addressUpdateStep: 'document-exchange-reference-details' },
        canActivate: [AddressUpdateStepGuard]
      },
      {
        path: 'check',
        component: UpdateAddressCheckComponent,
        data: { addressUpdateStep: 'check' },
        canActivate: [AddressUpdateStepGuard]
      }
    ]
  },
  {
    path: 'organisation/update-org-name',
    data: { role: 'pui-organisation-manager', updateType: 'name' },
    canActivate: [
      AuthGuard,
      UserRoleGuard,
      OrganisationDetailsUpdateGuard,
      HealthCheckGuard
    ],
    children: [
      {
        path: '',
        component: UpdateOrgNameComponent
      },
      {
        path: 'check',
        component: UpdateOrgNameCheckComponent,
        data: { updateType: 'name' },
        canActivate: [OrganisationUpdateCheckGuard]
      }
    ]
  },
  {
    path: 'organisation/update-sra',
    data: { role: 'pui-organisation-manager', updateType: 'sra' },
    canActivate: [
      AuthGuard,
      UserRoleGuard,
      OrganisationDetailsUpdateGuard,
      HealthCheckGuard
    ],
    children: [
      {
        path: '',
        component: UpdateSraComponent
      },
      {
        path: 'check',
        component: UpdateSraCheckComponent,
        data: { updateType: 'sra' },
        canActivate: [OrganisationUpdateCheckGuard]
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
