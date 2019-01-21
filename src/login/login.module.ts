import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {loginRouting} from './login.routing';
import {SharedModule} from '../app/shared/shared.module';

// containers
import * as fromContainers from './containers';

// services
import * as fromServices from './services';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import { reducers } from './store';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    loginRouting,
    SharedModule,
    StoreModule.forFeature('login', reducers),
    // EffectsModule.forFeature(effects),
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services]
})

/**
 * Entry point to LoginModule
 */

export class LoginModule {

}
