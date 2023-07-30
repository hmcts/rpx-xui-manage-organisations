import { ModuleWithProviders } from '@angular/core';
// routes
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './containers';
import { RegisterModule } from './register.module';

export const ROUTES: Routes = [
  {
    path: 'register',
    component: RegisterComponent
  }
];

export const registerRouting: ModuleWithProviders<RegisterModule> = RouterModule.forChild(ROUTES);
