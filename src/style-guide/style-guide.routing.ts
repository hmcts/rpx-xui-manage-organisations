// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { StyleGuideComponent } from './containers/style-guide/style-guide.component';
import {AuthGuard} from '../user-profile/guards/auth.guard';

export const ROUTES: Routes = [
    {
      path: '',
      component: StyleGuideComponent,
      data: {
        title: 'Style guide'
      }
      // canActivate: [AuthGuard],
    }
];


export const styleGuideRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
