import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {feeAccountsRouting} from './fee-accounts.routing';
import {SharedModule} from '../app/shared/shared.module';

// containers
import * as fromContainers from './containers';

// services
import * as fromServices from './services';
import {StoreModule} from '@ngrx/store';

import {HttpClientModule} from '@angular/common/http';
import { EffectsModule } from '@ngrx/effects';
import { reducers, effects } from './store';


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
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services]
})

/**
 * Entry point to FeeAccountsModule
 */

export class FeeAccountsModule {

}
