// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ProfileComponent } from './containers/profile/profile.component';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UserGuard } from './guards/user.guard';

export const ROUTES: Routes = [
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard, UserGuard ]
  }
];


export const authRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
