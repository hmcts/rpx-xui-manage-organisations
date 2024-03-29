// routes
import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user-profile/guards/auth.guard';
import { AccountOverviewComponent } from './containers/account-overview/account-overview.component';
import { AccountSummaryComponent } from './containers/account-summary/account-summary.component';
import { AccountTransactionsComponent } from './containers/account-transactions/account-transactions.component';
import { OrganisationAccountsComponent } from './containers/overview/account-overview.component';
import { FeeAccountsModule } from './fee-accounts.module';
import { AccountSummaryGuard } from './guards/acccounts-summary.guards';
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
    ]
  },
  {
    path: 'account',
    component: AccountOverviewComponent,
    canActivate: [
      AuthGuard
    ],
    children: [
      {
        path: ':id',
        component: AccountSummaryComponent,
        canActivate: [
          AccountSummaryGuard
        ]
      },
      {
        path: ':id/transactions',
        component: AccountTransactionsComponent
      }
    ]
  }
];

export const feeAccountsRouting: ModuleWithProviders<FeeAccountsModule> = RouterModule.forChild(ROUTES);
