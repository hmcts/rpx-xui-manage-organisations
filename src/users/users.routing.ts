// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsersComponent } from './containers';
import { UserFormComponent } from './containers/invite-user/user-form.component';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { InviteUserSuccessComponent } from './containers/invite-user-success/invite-user-success.component';

export const ROUTES: Routes = [
    {
      path: '',
      component: UsersComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'invite-user',
      component: UserFormComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'invite-user-success',
      component: InviteUserSuccessComponent,
      canActivate: [AuthGuard],
    }
];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
