// routes
import {ModuleWithProviders} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuard} from '../user-profile/guards/auth.guard';
import {AccountOverviewComponent} from './containers/account-overview/account-overview.component';
import {AccountSummaryComponent} from './containers/account-summary/account-summary.component';
import {AccountTransactionsComponent} from './containers/account-transactions/account-transactions.component';
import {OrganisationAccountsComponent} from './containers/overview/account-overview.component';
import {AccountSummaryGuard} from './guards/acccounts-summary.guards';
import { AccountsGuard } from './guards/accounts.guard';
import { FeatureToggleAccountGuard } from './guards/feature-toggle-account.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: OrganisationAccountsComponent,
    canActivate: [
      AuthGuard,
      FeatureToggleAccountGuard,
      AccountsGuard
    ],
  },
  {
    path: 'account',
    component: AccountOverviewComponent,
    canActivate: [
      AuthGuard
    ],
    data: {
      title: 'Account Overview'
    },
    children: [
      {
        path: ':id',
        component: AccountSummaryComponent,
        canActivate: [
          AccountSummaryGuard
        ],
        data: {
          title: 'Account Summary'
        }
      },
      {
        path: ':id/transactions',
        component: AccountTransactionsComponent,
        data: {
          title: 'Account Transactions'
        }
      }
    ]
  }
];


export const feeAccountsRouting: ModuleWithProviders = RouterModule.forChild(ROUTES);
