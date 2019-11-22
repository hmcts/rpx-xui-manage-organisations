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
    loadChildren: () => import('../organisation/organisation.module').then(m => m.OrganisationModule)
  },
  {
    path: 'users',
    canActivate: [AuthGuard, TermsConditionGuard],
    loadChildren: () => import('../users/users.module').then(m => m.UsersModule)
  },
  {
    path: 'fee-accounts',
    canActivate: [AuthGuard],
    loadChildren: () => import('../fee-accounts/fee-accounts.module').then(m => m.FeeAccountsModule)
  },
  {
    path: 'style-guide',
    canActivate: [AuthGuard],
    loadChildren: () => import('../style-guide/style-guide.module').then(m => m.StyleGuideModule)
  },
  {
    path: 'register-org',
    loadChildren: () => import('../register/register.module').then(m => m.RegisterModule)
  },
  {
    path: 'accept-t-and-c',
    canActivate: [AuthGuard, AcceptTermsAndConditionGuard],
    loadChildren: () => import('../accept-tc/accept-tc.module').then(m => m.AcceptTcModule)
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

