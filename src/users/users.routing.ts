// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';
import { EditUserPermissionComponent, EditUserPermissionsFailureComponent, UserDetailsComponent, UsersComponent } from './containers';
import { InviteUserSuccessComponent } from './containers/invite-user-success/invite-user-success.component';
import { InviteUserComponent } from './containers/invite-user/invite-user.component';
import { FeatureToggleEditUserGuard } from './guards/feature-toggle-edit-user.guard';
import { InviteUserSuccessGuard } from './guards/invite-user-success.guard';

export const ROUTES: Routes = [
    {
      path: '',
      component: UsersComponent,
      canActivate: [HealthCheckGuard],
      data: {
        title: 'Users'
      }
    },
    {
      path: 'user/:userId',
      component: UserDetailsComponent,
      data: {
        title: 'User Details'
      }
    },
    {
      path: 'invite-user',
      component: InviteUserComponent,
      canActivate: [HealthCheckGuard],
      data: {
        title: 'Invite User'
      }
    },
    {
      path: 'invite-user-success',
      component: InviteUserSuccessComponent,
      canActivate: [InviteUserSuccessGuard],
      data: {
        title: 'User Invited Successfully'
      }
    },
    {
      path: 'user/:userId/editpermission-failure',
      component: EditUserPermissionsFailureComponent,
      data: {
        title: 'Failed to Edit Permissions'
      }
    },
    {
      path: 'user/:userId/editpermission',
      component: EditUserPermissionComponent,
      canActivate: [FeatureToggleEditUserGuard],
      data: {
        title: 'Edit User Permissions'
      }
    }
];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
