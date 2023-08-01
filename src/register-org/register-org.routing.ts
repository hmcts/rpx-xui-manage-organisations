import { ModuleWithProviders } from '@angular/core';
// routes
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './containers';
import { RegisterOrgModule } from './register-org.module';

export const ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  }
];

export const registerRouting: ModuleWithProviders<RegisterOrgModule> = RouterModule.forChild(ROUTES);
