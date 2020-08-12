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
    loadChildren: '../organisation/organisation.module#OrganisationModule',
    data: {
      title: 'Organisation'
    }
  },
  {
    path: 'users',
    canActivate: [AuthGuard, TermsConditionGuard, HealthCheckGuard],
    loadChildren: '../users/users.module#UsersModule',
    data: {
      title: 'Users'
    }
  },
  {
    path: 'fee-accounts',
    canActivate: [AuthGuard, HealthCheckGuard],
    loadChildren: '../fee-accounts/fee-accounts.module#FeeAccountsModule',
    data: {
      title: 'Accounts'
    }
  },
  {
    path: 'unassigned-cases',
    canActivate: [AuthGuard, HealthCheckGuard],
    loadChildren: '../unassigned-cases/unassigned-cases.module#UnassignedCasesModule',
    data: {
      title: 'Unassigned Cases'
    }
  },
  {
    path: 'style-guide',
    canActivate: [AuthGuard],
    loadChildren: '../style-guide/style-guide.module#StyleGuideModule',
    data: {
      title: 'Style Guide'
    }
  },
  {
    path: 'register-org',
    loadChildren: '../register/register.module#RegisterModule',
    data: {
      title: 'Register Organisation'
    }
  },
  {
    path: 'accept-terms-and-conditions',
    canActivate: [AuthGuard, AcceptTermsAndConditionGuard],
    loadChildren: '../accept-tc/accept-tc.module#AcceptTcModule',
    data: {
      title: 'Accept Terms and Conditions'
    }
  },
  {
    path: 'service-down',
    component: ServiceDownComponent,
    data: {
      title: 'Service Unavailable'
    }
  },
  {
    path: 'home',
    component: RedirectComponent
  },
  {
    path: 'cookies',
    component: CookiePolicyComponent,
    data: {
      title: 'Cookie Policy'
    }
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
    data: {
      title: 'Privacy Policy'
    }
  },
  {
    path: 'terms-and-conditions',
    component: TermsAndConditionsComponent,
    data: {
      title: 'Terms & Conditions'
    }
  },
  {
    path: 'accessibility',
    component: AccessibilityComponent,
    data: {
      title: 'Accessibility'
    }
  },
  {
    path: 'get-help',
    component: GetHelpComponent,
    data: {
      title: 'Get Help'
    }
  },
  {
    path: 'idle-sign-out',
    component: SignedOutComponent,
    data: {
      title: 'Signed Out'
    }
  },
  {
    path: '**',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

