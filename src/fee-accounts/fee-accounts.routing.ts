// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {FeeAccountsComponent, SingleFeeAccountComponent} from './containers';
import {AuthGuard} from '../auth/guards/auth.guard';

// TODO how can we improve this?

export const ROUTES: Routes = [
  {
    path: 'fee-accounts',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: FeeAccountsComponent
      },
      {
        path: 'account',
        component: FeeAccountsComponent
      },
      {
        path: 'account/:id',
        component: SingleFeeAccountComponent,
        children: [
          {
            path: 'summary',
            component: SingleFeeAccountComponent
          },
          {
            path: 'transactions',
            component: SingleFeeAccountComponent
          }

        ]
      }
    ]
  }
];


export const feeAccountsRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
