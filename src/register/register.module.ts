import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { registerRouting } from './register.routing';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponent from './components';

// services
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromServices from './services';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AddressService, ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { HmctsFormBuilderModule } from './containers/hmcts-form-builder/src/lib/hmcts-form-builder.module';
import { effects, reducers } from './store';

@NgModule({ exports: [...fromContainers.containers, ...fromComponent.components],
    declarations: [...fromContainers.containers, ...fromComponent.components], imports: [CommonModule,
        ExuiCommonLibModule,
        HmctsFormBuilderModule,
        registerRouting,
        SharedModule,
        StoreModule.forFeature('registration', reducers),
        EffectsModule.forFeature(effects)], providers: [AddressService, ...fromServices.services, provideHttpClient(withInterceptorsFromDi())] })

/**
 * Entry point to RegisterModule
 */

export class RegisterModule {}
