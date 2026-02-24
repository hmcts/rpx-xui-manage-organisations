// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OrganisationComponent } from './containers';
import { UpdatePbaNumbersCheckComponent } from './containers/update-pba-check/update-pba-numbers-check.component';
import { UpdatePbaNumbersComponent } from './containers/update-pba-numbers/update-pba-numbers.component';

import { OrganisationGuard } from 'src/organisation/guards/organisation.guard';
import { AuthGuard } from 'src/user-profile/guards/auth.guard';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';
import { UserRoleGuard } from 'src/shared/guards/user-role.guard';
import { OrganisationModule } from './organisation.module';

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
