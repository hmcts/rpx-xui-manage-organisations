// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { OrganisationComponent } from './containers';
import { AuthGuard } from '../auth/guards/auth.guard';
import { OrganisationGuard } from 'src/auth/guards/organisation.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: OrganisationComponent,
    canActivate: [
      AuthGuard,
      OrganisationGuard]
  }
];


export const organisationRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
