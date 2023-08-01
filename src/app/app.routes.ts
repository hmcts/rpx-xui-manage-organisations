import { Routes } from '@angular/router';
import { FeatureToggleGuard } from '@hmcts/rpx-xui-common-lib';
import { AcceptTermsAndConditionGuard } from '../accept-tc/guards/acceptTermsAndCondition.guard';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { AccessibilityComponent, CookiePolicyComponent, GetHelpComponent, PrivacyPolicyComponent, ServiceDownComponent, SignedOutComponent, TermsAndConditionsComponent } from './components';
import { RedirectComponent } from './containers/redirect/redirect.component';
import { TermsConditionGuard } from './guards/termsCondition.guard';
import { AppConstants } from './app.constants';

export const ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'organisation',
    canActivate: [AuthGuard, TermsConditionGuard, HealthCheckGuard],
    loadChildren: () => import('../organisation/organisation.module').then((m) => m.OrganisationModule)
  },
  {
    path: 'users',
    canActivate: [AuthGuard, TermsConditionGuard, HealthCheckGuard],
    loadChildren: () => import('../users/users.module').then((m) => m.UsersModule)
  },
  {
    path: 'fee-accounts',
    canActivate: [AuthGuard, HealthCheckGuard],
    loadChildren: () => import('../fee-accounts/fee-accounts.module').then((m) => m.FeeAccountsModule)
  },
  {
    path: 'unassigned-cases',
    canActivate: [AuthGuard, HealthCheckGuard],
    loadChildren: () => import('../caa-cases/caa-cases.module').then((m) => m.CaaCasesModule)
  },
  {
    path: 'assigned-cases',
    canActivate: [AuthGuard, HealthCheckGuard],
    loadChildren: () => import('../caa-cases/caa-cases.module').then((m) => m.CaaCasesModule)
  },
  {
    path: 'style-guide',
    canActivate: [AuthGuard],
    loadChildren: () => import('../style-guide/style-guide.module').then((m) => m.StyleGuideModule)
  },
  {
    path: 'register-org',
    loadChildren: () => import('../register/register.module').then((m) => m.RegisterModule)
  },
  {
    path: 'register-org-new',
    loadChildren: () => import('../register-org/register-org.module').then((m) => m.RegisterOrgModule),
    canActivate: [FeatureToggleGuard],
    data: {
      title: 'Register Organisation',
      needsFeaturesEnabled: [AppConstants.FEATURE_NAMES.newRegisterOrg],
      featureDisabledRedirect: '/register-org'
    }
  },
  {
    path: 'accept-terms-and-conditions',
    canActivate: [AuthGuard, AcceptTermsAndConditionGuard],
    loadChildren: () => import('../accept-tc/accept-tc.module').then((m) => m.AcceptTcModule)
  },
  {
    path: 'service-down',
    component: ServiceDownComponent
  },
  {
    canActivate: [AuthGuard, HealthCheckGuard],
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

