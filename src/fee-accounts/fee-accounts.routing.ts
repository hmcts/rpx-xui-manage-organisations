// routes
import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';
import {AuthGuard} from '../auth/guards/auth.guard';
import {AccountOverviewComponent} from './containers/account-overview/account-overview.component';
import {AccountSummaryComponent} from './containers/account-summary/account-summary.component';
import {AccountTransactionsComponent} from './containers/account-transactions/account-transactions.component';
import {AccountsOverviewComponent} from './containers/overview/account-overview.component';
import {PbaSummaryGuard} from './guards/pba-summary.guards';

export const ROUTES: Routes = [
  {
    path: 'fee-accounts',
    redirectTo: 'fee-accounts/overview',
    pathMatch: 'full',
  },
  {
    path: 'fee-accounts',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'overview',
        component: AccountsOverviewComponent
      },
      {
        path: 'account/:id',
        component: AccountOverviewComponent,
        children: [
          {
            path: 'summary',
            component: AccountSummaryComponent,
            // canActivate: [PbaSummaryGuard]
          },
          {
            path: 'transactions',
            component: AccountTransactionsComponent
          }

        ]
      }
    ]
  }
];


export const feeAccountsRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
