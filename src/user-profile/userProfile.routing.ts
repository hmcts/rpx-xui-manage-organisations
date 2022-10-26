// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './/guards/auth.guard';
import { ProfileComponent } from './containers/profile/profile.component';
import { UserGuard } from './guards/user.guard';

// TODO please remove when profile story gets runned


export const ROUTES: Routes = [
  {
    path: 'profile',
    // component: ProfileComponent,
    // // canActivate: [AuthGuard, UserGuard ]
    // canActivate: [false]
    redirectTo: 'organisation',
    pathMatch: 'full',
  }
];


export const userProfileRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
