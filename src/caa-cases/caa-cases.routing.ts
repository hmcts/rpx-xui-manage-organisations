import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { CaaCasesModule } from './caa-cases.module';
import { CaaCasesComponent, CaseShareCompleteComponent, CaseShareComponent, CaseShareConfirmComponent, CasesComponent } from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';
import { NewCaseFeatureToggleGuard } from './guards/new-cases-feature-toggle.guard';

export const ROUTES: Routes = [
  {
    path: 'all',
    component: CasesComponent,
    canActivate: [
      AuthGuard,
      NewCaseFeatureToggleGuard,
      RoleGuard
    ]
  },
  {
    path: '',
    component: CaaCasesComponent,
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
    path: 'all/case-share',
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
  }
];

export const caaCasesRouting: ModuleWithProviders<CaaCasesModule> = RouterModule.forChild(ROUTES);
