// routes
import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders } from '@angular/core';
import { UsersComponent, ProfileComponent } from './containers';
import { UserformComponent } from './containers/userform/userform.component';

export const ROUTES: Routes = [

      {
        path: 'users',
        component: UsersComponent
      },
      {
        path: 'userform',
        component: UserformComponent
      },
      {
        path: 'profile',
        component: ProfileComponent
      }

];


export const usersRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
