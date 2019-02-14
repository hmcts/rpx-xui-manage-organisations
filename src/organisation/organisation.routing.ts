// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { OrganisationComponent } from './containers';
import {AuthService} from '../auth/auth.service';

export const ROUTES: Routes = [
  {
    path: 'organisation',
    component: OrganisationComponent,
    canActivate: [AuthService]
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
