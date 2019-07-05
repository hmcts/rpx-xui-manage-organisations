// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { OrganisationComponent } from './containers';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { OrganisationGuard } from 'src/organisation/guards/organisation.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    canActivate: [
      AuthGuard,
      OrganisationGuard
    ]
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
