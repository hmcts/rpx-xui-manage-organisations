import { NgModule, ErrorHandler } from '@angular/core';

import { CommonModule } from '@angular/common';
import { organisationRouting } from './organisation.routing';
import { SharedModule } from '../shared/shared.module';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponent from './components';

// services
import * as fromServices from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
import { HttpClientModule } from '@angular/common/http';
import { OrganisationGuard } from './guards/organisation.guard';
import { MonitoringService } from '../shared/services/monitoring.service';
import { AbstractAppInsights, AppInsightsWrapper } from '../shared/services/appInsightsWrapper';
import { LoggerService } from '../shared/services/logger.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DefaultErrorHandler } from '../shared/errorHandler/defaultErrorHandler';
import { CryptoWrapper } from '../shared/services/cryptoWrapper';
import { JwtDecodeWrapper } from '../shared/services/jwtDecodeWrapper';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    organisationRouting,
    SharedModule,
    StoreModule.forFeature('org', reducers),
    EffectsModule.forFeature(effects),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      disableConsoleLogging: false
     }),
    ExuiCommonLibModule,
    RxReactiveFormsModule
  ],
  exports: [...fromContainers.containers, ...fromComponent.components],
  declarations: [...fromContainers.containers, ...fromComponent.components],
  providers: [...fromServices.services, OrganisationGuard,
  { provide: AbstractAppInsights, useClass: AppInsightsWrapper},
  CryptoWrapper, JwtDecodeWrapper, MonitoringService, LoggerService,
  {provide: ErrorHandler, useClass: DefaultErrorHandler}]
})



export class OrganisationModule {

}
