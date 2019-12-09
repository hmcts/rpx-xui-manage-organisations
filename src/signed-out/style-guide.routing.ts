// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { SignedOutComponent } from './containers/signed-out/signed-out.component';
import {AuthGuard} from '../user-profile/guards/auth.guard';

export const ROUTES: Routes = [
    {
      path: '',
      component: SignedOutComponent,
      // canActivate: [AuthGuard],
    }
];


export const styleGuideRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
