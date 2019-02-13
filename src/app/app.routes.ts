import { Routes } from '@angular/router';

export const ROUTES: Routes = [
  {
    path: '',
    component: UsersModule,
    canActivate: [AuthService],
    data: { roles: ['caseworker-probatex'] }
  },
];
