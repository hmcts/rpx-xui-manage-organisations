import { Routes } from '@angular/router';
import { AcceptTermsAndConditionGuard } from '../accept-tc/guards/acceptTermsAndCondition.guard';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { AccessibilityComponent, CookiePolicyComponent, GetHelpComponent, PrivacyPolicyComponent, ServiceDownComponent, SignedOutComponent, TermsAndConditionsComponent } from './components';
import { RedirectComponent } from './containers/redirect/redirect.component';
import {TermsConditionGuard} from './guards/termsCondition.guard';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    canActivate: [AuthGuard, HealthCheckGuard],
    pathMatch: 'full',
  },
  {
    path: 'organisation',
    canActivate: [AuthGuard, TermsConditionGuard, HealthCheckGuard],
    loadChildren: '../organisation/organisation.module#OrganisationModule'
  },
  {
    path: 'users',
    canActivate: [AuthGuard, TermsConditionGuard, HealthCheckGuard],
    loadChildren: '../users/users.module#UsersModule'
  },
  {
    path: 'fee-accounts',
    canActivate: [AuthGuard, HealthCheckGuard],
    loadChildren: '../fee-accounts/fee-accounts.module#FeeAccountsModule'
  },
  {
    path: 'unassigned-cases',
    canActivate: [AuthGuard, HealthCheckGuard],
    loadChildren: '../unassigned-cases/unassigned-cases.module#UnassignedCasesModule'
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
    path: 'accept-terms-and-conditions',
    canActivate: [AuthGuard, AcceptTermsAndConditionGuard],
    loadChildren: '../accept-tc/accept-tc.module#AcceptTcModule'
  },
  {
    path: 'service-down',
    component: ServiceDownComponent
  },
  {
    canActivate: [AuthGuard],
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
    path: 'get-help',
    component: GetHelpComponent
  },
  {
    path: 'idle-sign-out',
    component: SignedOutComponent
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

