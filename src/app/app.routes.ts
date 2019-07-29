import { Routes } from '@angular/router';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { ServiceDownComponent } from './containers/service-down/service-down.component';


export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'organisation',
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'organisation',
    canActivate: [AuthGuard],
    loadChildren: '../organisation/organisation.module#OrganisationModule'
  },
  {
    path: 'users',
    canActivate: [AuthGuard],
    loadChildren: '../users/users.module#UsersModule'
  },
  {
    path: 'style-guide',
    canActivate: [AuthGuard],
    loadChildren: '../style-guide/style-guide.module#StyleGuideModule'
  },
  {
    path: 'register-org',
    canActivate: [AuthGuard],
    loadChildren: '../register/register.module#RegisterModule'
  },
  {
    path: 'service-down',
    component: ServiceDownComponent
  },
  {
    path: '**',
    redirectTo: '/organisation',
    pathMatch: 'full'
  }
];

