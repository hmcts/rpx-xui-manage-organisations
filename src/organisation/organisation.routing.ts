// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrganisationGuard } from 'src/organisation/guards/organisation.guard';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';
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
