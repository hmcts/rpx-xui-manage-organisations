// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsersComponent } from './containers';
import { InviteUserComponent } from './containers/invite-user/invite-user.component';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { InviteUserSuccessComponent } from './containers/invite-user-success/invite-user-success.component';
import { InviteUserSuccessGuard } from './guards/invite-user-success.guard';

export const ROUTES: Routes = [
    {
      path: '',
      component: UsersComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'invite-user',
      component: InviteUserComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'invite-user-success',
      component: InviteUserSuccessComponent,
      canActivate: [AuthGuard, InviteUserSuccessGuard],
    }
];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
