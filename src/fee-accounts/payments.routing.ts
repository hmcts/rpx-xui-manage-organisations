// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {FeeAccountsComponent, SummaryComponent, TransactionsComponent} from './containers';

export const ROUTES: Routes = [
  {
    path: 'payments',
    children: [
      {
        path: '',
        component: FeeAccountsComponent
      },
      {
        path: 'summary',
        component: FeeAccountsComponent
      },
      {
        path: 'summary/:id',
        component: SummaryComponent
      },
      {
        path: 'transactions',
        component: FeeAccountsComponent
      },
      {
        path: 'transactions/:id',
        component: TransactionsComponent
      }
    ]
  }
];


export const paymentsRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
