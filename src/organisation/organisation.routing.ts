// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationGuard } from 'src/organisation/guards/organisation.guard';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';
import { OrganisationComponent } from './containers';

export const ROUTES: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    canActivate: [
      OrganisationGuard,
      HealthCheckGuard,
    ],
    data: {
      title: 'Organisation'
    }
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
