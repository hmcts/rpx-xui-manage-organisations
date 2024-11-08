import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { CaaCasesModule } from './cases.module';
import { CaseShareCompleteComponent, CaseShareComponent, CaseShareConfirmComponent, CasesComponent } from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';
import { AcceptCasesComponent } from './containers/accept-cases/accept-cases.component';

export const ROUTES: Routes = [
  {
    path: '',
    component: CasesComponent,
    canActivate: [
      AuthGuard,
      FeatureToggleAccountGuard,
      RoleGuard
    ]
  },
  {
    path: 'case-share',
    component: CaseShareComponent,
    canActivate: [
      AuthGuard,
      FeatureToggleAccountGuard,
      RoleGuard
    ]
  },
  {
    path: 'case-share-confirm/:pageType',
    component: CaseShareConfirmComponent,
    canActivate: [
      AuthGuard,
      FeatureToggleAccountGuard,
      RoleGuard
    ]
  },
  {
    path: 'case-share-complete/:pageType',
    component: CaseShareCompleteComponent,
    canActivate: [
      AuthGuard,
      FeatureToggleAccountGuard,
      RoleGuard
    ]
  },
  {
    path: 'accept-cases',
    component: AcceptCasesComponent,
    canActivate: [
      AuthGuard,
      FeatureToggleAccountGuard,
      RoleGuard
    ]
  }
];

export const casesRouting: ModuleWithProviders<CaaCasesModule> = RouterModule.forChild(ROUTES);
