// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StyleGuideComponent } from './containers/style-guide/style-guide.component';
import { StyleGuideModule } from './style-guide.module';

export const ROUTES: Routes = [
  {
    path: '',
    component: StyleGuideComponent
    // canActivate: [AuthGuard],
  }
];

export const styleGuideRouting: ModuleWithProviders<StyleGuideModule> = RouterModule.forChild(ROUTES);
