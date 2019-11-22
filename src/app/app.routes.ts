import { Routes } from '@angular/router';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { AccessibilityComponent, CookiePolicyComponent, PrivacyPolicyComponent, ServiceDownComponent } from './components';
import { TermsAndConditionsComponent } from './containers';
import { RedirectComponent } from './containers/redirect/redirect.component';
import {TermsConditionGuard} from './guards/termsCondition.guard';
import { AcceptTermsAndConditionGuard } from '../accept-tc/guards/acceptTermsAndCondition.guard';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    canActivate: [AuthGuard],
    pathMatch: 'full',
  },
  {
    path: 'organisation',
    canActivate: [AuthGuard, TermsConditionGuard],
    loadChildren: '../organisation/organisation.module#OrganisationModule'
  },
  {
    path: 'users',
    canActivate: [AuthGuard, TermsConditionGuard],
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
    path: 'accept-t-and-c',
    canActivate: [AuthGuard, AcceptTermsAndConditionGuard],
    loadChildren: '../accept-tc/accept-tc.module#AcceptTcModule'
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

