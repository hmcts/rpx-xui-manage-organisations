// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsersComponent, ProfileComponent } from './containers';
import { UserformComponent } from './containers/userform/userform.component';
import {AuthGuard} from '../auth/guards/auth.guard';

export const ROUTES: Routes = [

      {
        path: 'users',
        component: UsersComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'userform',
        component: UserformComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [AuthGuard]
      }

];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
