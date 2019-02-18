// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { OrganisationComponent } from './containers';
import {AuthGuard} from '../auth/guards/auth.guard';

export const ROUTES: Routes = [
  {
    path: 'organisation',
    component: OrganisationComponent,
    canActivate: [AuthGuard]
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
