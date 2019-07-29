// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {RegisterComponent} from './containers';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';

export const ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register/:pageId',
    component: RegisterComponent,
    canActivate: [HealthCheckGuard]
  }
];

export const registerRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
