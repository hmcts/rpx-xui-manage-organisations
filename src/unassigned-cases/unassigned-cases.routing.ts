import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/user-profile/guards/auth.guard';
import { UnassignedCasesComponent } from './containers';

export const ROUTES: Routes = [
    {
        path: '',
        component: UnassignedCasesComponent,
        canActivate: [
            AuthGuard,
        ],
    },
];

export const unassignedCasesRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
