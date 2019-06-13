// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {RegisterComponent} from './containers';

export const ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'register/:pageId',
    component: RegisterComponent
  }
];

export const registerRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
