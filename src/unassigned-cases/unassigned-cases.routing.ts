import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/user-profile/guards/auth.guard';
import { CaseShareCompleteComponent, CaseShareComponent, CaseShareConfirmComponent, UnassignedCasesComponent } from './containers';
import { FeatureToggleAccountGuard } from './guards/feature-toggle.guard';
import { RoleGuard } from './guards/user-role.guard';

export const ROUTES: Routes = [
    {
        path: '',
        component: UnassignedCasesComponent,
        canActivate: [
            AuthGuard,
            FeatureToggleAccountGuard,
            RoleGuard
        ],
        children: [
          {
            path: ':id',
            component: UnassignedCasesComponent,
            canActivate: [
              AuthGuard,
              FeatureToggleAccountGuard,
              RoleGuard
            ]
          }
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

export const unassignedCasesRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
