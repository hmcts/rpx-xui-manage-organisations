// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsersComponent, UserDetailsComponent, EditUserPermissionComponent } from './containers';
import { InviteUserComponent } from './containers/invite-user/invite-user.component';
import { InviteUserSuccessComponent } from './containers/invite-user-success/invite-user-success.component';
import { InviteUserSuccessGuard } from './guards/invite-user-success.guard';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';

export const ROUTES: Routes = [
    {
      path: '',
      component: UsersComponent,
      canActivate: [HealthCheckGuard],
    },
    {
      path: 'user/:userId',
      component: UserDetailsComponent
    },
    {
      path: 'invite-user',
      component: InviteUserComponent,
      canActivate: [HealthCheckGuard],
    },
    {
      path: 'invite-user-success',
      component: InviteUserSuccessComponent,
      canActivate: [InviteUserSuccessGuard],
    },
    {
      path: 'user/:userId/editpermission',
      component: EditUserPermissionComponent,
    }
];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
