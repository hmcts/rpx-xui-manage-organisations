// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';

import { OrganisationComponent } from './containers';
import { UpdatePbaNumbersComponent } from './containers/update-pba-numbers/update-pba-numbers.component';

import { OrganisationGuard } from 'src/organisation/guards/organisation.guard';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';
import { UserRoleGuard } from 'src/shared/guards/user-role.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    canActivate: [
      OrganisationGuard,
      HealthCheckGuard,
    ]
  },
  {
    path: 'update-pba-numbers',
    component: UpdatePbaNumbersComponent,
    data: { role: 'pui-finance-manager' },
    canActivate: [
      OrganisationGuard,
      UserRoleGuard
    ]
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
