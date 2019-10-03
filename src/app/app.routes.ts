import { Routes } from '@angular/router';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { ServiceDownComponent } from './containers/service-down/service-down.component';
import {RedirectComponent} from './containers/redirect/redirect.component';
import { CookiePolicyComponent } from './containers/cookie-policy/cookie-policy.component';
import { PrivacyPolicyComponent } from './containers';
import { TermsAndConditionsComponent } from './containers';
import { AccountSummaryComponent } from 'src/fee-accounts/containers/account-summary/account-summary.component';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
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
    path: 'fee-accounts',
    canActivate: [AuthGuard],
    loadChildren: '../fee-accounts/fee-accounts.module#FeeAccountsModule'
  },
  {
    path: 'style-guide',
    canActivate: [AuthGuard],
    loadChildren: '../style-guide/style-guide.module#StyleGuideModule'
  },
  {
    path: 'register-org',
    loadChildren: '../register/register.module#RegisterModule'
  },
  {
    path: 'service-down',
    component: ServiceDownComponent
  },
  {
    path: 'home',
    component: RedirectComponent
  },
  {
    path: 'cookies',
    component: CookiePolicyComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent
  },
  {
    path: 'accessibility',
    component: AccessibilityComponent
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

