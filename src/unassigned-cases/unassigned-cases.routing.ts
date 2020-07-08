import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/user-profile/guards/auth.guard';
import { UnassignedCasesComponent } from './containers';
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
    },
];

export const unassignedCasesRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
