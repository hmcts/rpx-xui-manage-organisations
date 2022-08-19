// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationGuard } from './guards/organisation.guard';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { OrganisationComponent } from './containers';
import { OrganisationModule } from './organisation.module';

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

export const organisationRouting: ModuleWithProviders<OrganisationModule> = RouterModule.forChild(ROUTES);
