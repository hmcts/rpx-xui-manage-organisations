import { Routes } from '@angular/router';


export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'organisation',
    pathMatch: 'full',
  },
  {
    path: 'organisation',
    loadChildren: '../organisation/organisation.module#OrganisationModule'
  },
  {
    path: 'users',
    loadChildren: '../users/users.module#UsersModule'
  },
  {
    path: 'profile',
    loadChildren: '../auth/auth.module#AuthModule'
  },
  {
    path: '**',
    redirectTo: '/organisation',
    pathMatch: 'full'
  }
];

