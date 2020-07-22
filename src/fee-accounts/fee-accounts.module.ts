import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {feeAccountsRouting} from './fee-accounts.routing';

// containers
import * as fromContainers from './containers';

// services
import {StoreModule} from '@ngrx/store';
import * as fromServices from './services';

import {HttpClientModule} from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { OrganisationService } from 'src/organisation/services';
import { DateFormatAtTimePipe } from 'src/shared/components/custom-pipe/date-pipe-with-to';
import { effects as orgEffects, reducers as orgReducers } from '../organisation/store';
import { AccountOverviewComponent } from './containers/account-overview/account-overview.component';
import { AccountSummaryComponent } from './containers/account-summary/account-summary.component';
import { AccountTransactionsComponent } from './containers/account-transactions/account-transactions.component';
import {AccountSummaryGuard} from './guards/acccounts-summary.guards';
import {AccountsGuard} from './guards/accounts.guard';
import { FeatureToggleAccountGuard } from './guards/feature-toggle-account.guard';
import { effects, reducers } from './store';

export const GUARDS = [FeatureToggleAccountGuard, AccountsGuard, AccountSummaryGuard];
export const COMPONENTS = [ AccountOverviewComponent, AccountSummaryComponent, AccountTransactionsComponent];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    feeAccountsRouting,
    SharedModule,
    StoreModule.forFeature('feeAccounts', reducers),
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('org', orgReducers),
    EffectsModule.forFeature(orgEffects),
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers, ...COMPONENTS, DateFormatAtTimePipe],
  providers: [...fromServices.services, ...GUARDS, OrganisationService]
})

/**
 * Entry point to FeeAccountsModule
 */

export class FeeAccountsModule {

}
