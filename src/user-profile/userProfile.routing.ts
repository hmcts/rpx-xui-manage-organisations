// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// TODO please remove when profile story gets runned


export const ROUTES: Routes = [
  {
    path: 'profile',
    // component: ProfileComponent,
    // // canActivate: [AuthGuard, UserGuard ]
    // canActivate: [false]
    redirectTo: 'organisation',
    pathMatch: 'full',
  }
];


export const userProfileRouting: ModuleWithProviders<RouterModule> = RouterModule.forChild(ROUTES);
