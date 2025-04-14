import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AddressService, ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RpxTranslationConfig, RpxTranslationService } from 'rpx-xui-translation';
import { SharedModule } from '../shared/shared.module';
import * as fromComponent from './components';
import * as fromContainers from './containers';
import { registerRouting } from './register-org.routing';
import * as fromServices from './services';

@NgModule({ exports: [...fromContainers.containers, ...fromComponent.components],
    declarations: [...fromContainers.containers, ...fromComponent.components], imports: [CommonModule,
        ExuiCommonLibModule,
        registerRouting,
        SharedModule], providers: [AddressService, RpxTranslationService, RpxTranslationConfig, ...fromServices.services, provideHttpClient(withInterceptorsFromDi())] })

export class RegisterOrgModule {}
