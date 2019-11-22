// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { OrganisationComponent } from './containers';
import { OrganisationGuard } from 'src/organisation/guards/organisation.guard';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';
import {TermsConditionGuard} from '../app/guards/termsCondition.guard';

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
