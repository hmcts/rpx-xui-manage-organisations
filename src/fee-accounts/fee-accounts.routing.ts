// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {FeeAccountsComponent, TransactionsComponent, SingleFeeAccountComponent} from './containers';
import {AuthService} from '../auth/auth.service';

export const ROUTES: Routes = [
  {
    path: 'fee-accounts',
    canActivate: [AuthService],
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
