// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsersComponent } from './containers';
import { UserFormComponent } from './containers/invite-user/user-form.component';
import { AuthGuard } from '../user-profile/guards/auth.guard';

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
    }
];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
