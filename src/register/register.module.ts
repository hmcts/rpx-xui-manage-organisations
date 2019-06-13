import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {registerRouting} from './register.routing';
import {SharedModule} from '../shared/shared.module';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponent from './components';

// services
import * as fromServices from './services';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';

import { reducers, effects } from './store';
import {HttpClientModule} from '@angular/common/http';
import {HmctsFormBuilderModule} from './containers/hmcts-form-builder/src/lib/hmcts-form-builder.module';



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
