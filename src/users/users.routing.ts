// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HealthCheckGuard } from 'src/shared/guards/health-check.guard';
import {UsersComponent, UserDetailsComponent, EditUserPermissionComponent, EditUserPermissionsFailureComponent} from './containers';
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
        title: 'User details'
      }
    },
    {
      path: 'invite-user',
      component: InviteUserComponent,
      canActivate: [HealthCheckGuard],
      data: {
        title: 'Invite user'
      }
    },
    {
      path: 'invite-user-success',
      component: InviteUserSuccessComponent,
      canActivate: [InviteUserSuccessGuard],
      data: {
        title: 'You\'ve invited'
      }
    },
    {
      path: 'user/:userId/editpermission-failure',
      component: EditUserPermissionsFailureComponent,
      data: {
        title: 'Sorry, there is a problem with the service'
      }
    },
    {
      path: 'user/:userId/editpermission',
      component: EditUserPermissionComponent,
      canActivate: [FeatureToggleEditUserGuard],
      data: {
        title: 'Edit user'
      }
    }
];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
