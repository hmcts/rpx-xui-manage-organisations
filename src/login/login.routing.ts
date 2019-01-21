// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {LoginComponent} from './containers';

export const ROUTES: Routes = [
  {
    path: 'login',
    component: LoginComponent
  }
];


export const loginRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
