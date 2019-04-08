// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { StyleGuideComponent } from './containers/style-guide/style-guide.component';
import {AuthGuard} from '../auth/guards/auth.guard';

export const ROUTES: Routes = [
    {
      path: '',
      component: StyleGuideComponent,
      // canActivate: [AuthGuard],
    }
];


export const styleGuideRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
