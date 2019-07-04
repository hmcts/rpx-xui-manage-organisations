// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { ProfileComponent } from './containers/profile/profile.component';
import { AuthGuard } from './/guards/auth.guard';
import { UserGuard } from './guards/user.guard';
// TODO please remove when profile sotry is run
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
