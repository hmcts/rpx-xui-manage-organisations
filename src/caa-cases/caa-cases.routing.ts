import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/user-profile/guards/auth.guard';
import { CaseShareCompleteComponent, CaseShareComponent, CaseShareConfirmComponent, CaaCasesComponent } from './containers';
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

export const caaCasesRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
