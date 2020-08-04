// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StyleGuideComponent } from './containers/style-guide/style-guide.component';

export const ROUTES: Routes = [
    {
      path: '',
      component: StyleGuideComponent,
      // canActivate: [AuthGuard],
      data: {
        title: 'Style Guide'
      }
    }
];


export const styleGuideRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
