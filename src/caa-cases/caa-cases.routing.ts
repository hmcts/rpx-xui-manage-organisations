import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { CaaCasesModule } from './caa-cases.module';
import {
  CaaCasesComponent,
  CaseShareCompleteComponent,
  CaseShareComponent,
  CaseShareConfirmComponent
} from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';

export const ROUTES: Routes = [
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
      path: 'case-share-confirm',
      component: CaseShareConfirmComponent,
      canActivate: [
        AuthGuard,
        FeatureToggleAccountGuard,
        RoleGuard
      ]
    },
    {
      path: 'case-share-complete',
      component: CaseShareCompleteComponent,
      canActivate: [
        AuthGuard,
        FeatureToggleAccountGuard,
        RoleGuard
      ]
    }
];

export const caaCasesRouting: ModuleWithProviders<CaaCasesModule> = RouterModule.forChild(ROUTES);
