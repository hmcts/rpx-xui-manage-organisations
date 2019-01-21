// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { OrganisationComponent } from './containers';

export const ROUTES: Routes = [
  {
    path: 'organisation',
    component: OrganisationComponent
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
