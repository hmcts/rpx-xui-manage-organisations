import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
// components
import * as fromComponent from './components';
// containers
import * as fromContainers from './containers';
import { HmctsFormBuilderModule } from './containers/hmcts-form-builder/src/lib/hmcts-form-builder.module';
import { registerRouting } from './register.routing';
// services
import * as fromServices from './services';
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
    ExuiCommonLibModule.forChild()
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
