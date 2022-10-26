import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {registerRouting} from './register.routing';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponent from './components';

// services
import {EffectsModule} from '@ngrx/effects';
import {StoreModule} from '@ngrx/store';
import * as fromServices from './services';

import {HttpClientModule} from '@angular/common/http';
import {HmctsFormBuilderModule} from './containers/hmcts-form-builder/src/lib/hmcts-form-builder.module';
import { effects, reducers } from './store';



@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    HmctsFormBuilderModule,
    registerRouting,
    SharedModule,
    StoreModule.forFeature('registration', reducers),
    EffectsModule.forFeature(effects),

  ],
  exports: [...fromContainers.containers, ...fromComponent.components],
  declarations: [...fromContainers.containers, ...fromComponent.components],
  providers: [...fromServices.services]
})

/**
 * Entry point to RegisterModule
 */

export class RegisterModule {

}
