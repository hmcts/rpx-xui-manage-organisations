// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationGuard } from '../organisation/guards/organisation.guard';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { OrganisationComponent } from './containers';

export const ROUTES: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    canActivate: [
      OrganisationGuard,
      HealthCheckGuard,
    ]
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
