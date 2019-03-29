import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {feeAccountsRouting} from './fee-accounts.routing';
import {SharedModule} from '../shared/shared.module';

// containers
import * as fromContainers from './containers';

// services
import * as fromServices from './services';
import {StoreModule} from '@ngrx/store';

import {HttpClientModule} from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';
import { AccountOverviewComponent } from './containers/account-overview/account-overview.component';
import { AccountSummaryComponent } from './containers/account-summary/account-summary.component';
import { AccountTransactionsComponent } from './containers/account-transactions/account-transactions.component';
import {AccountsGuard} from './guards/accounts.guard';
import {AccountSummaryGuard} from './guards/acccounts-summary.guards';

export const GUARDS = [AccountsGuard, AccountSummaryGuard];
export const COMPONENTS = [ AccountOverviewComponent, AccountSummaryComponent, AccountTransactionsComponent];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    feeAccountsRouting,
    SharedModule,
    StoreModule.forFeature('feeAccounts', reducers),
    EffectsModule.forFeature(effects),
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers, ...COMPONENTS],
  providers: [...fromServices.services, ...GUARDS]
})

/**
 * Entry point to FeeAccountsModule
 */

export class FeeAccountsModule {

}
