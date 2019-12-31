import { NgModule, ErrorHandler } from '@angular/core';

import { CommonModule } from '@angular/common';
import { organisationRouting } from './organisation.routing';
import { SharedModule } from '../shared/shared.module';

// containers
import * as fromContainers from './containers';

// services
import * as fromServices from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers, effects } from './store';
import { HttpClientModule } from '@angular/common/http';
import { OrganisationGuard } from './guards/organisation.guard';
import { MonitoringService } from '../shared/services/monitoring.service';
import { AbstractAppInsights, AppInsightsWrapper } from 'src/shared/services/appInsightsWrapper';
import { LoggerService } from '../shared/services/logger.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DefaultErrorHandler } from 'src/shared/errorHandler/defaultErrorHandler';
import { CryptoWrapper } from 'src/shared/services/cryptoWrapper';
import { JwtDecodeWrapper } from 'src/shared/services/jwtDecodeWrapper';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    organisationRouting,
    ExuiCommonLibModule.forChild(),
    SharedModule,
    StoreModule.forFeature('org', reducers),
    EffectsModule.forFeature(effects),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      disableConsoleLogging: false
    }),
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services, OrganisationGuard,
  { provide: AbstractAppInsights, useClass: AppInsightsWrapper},
  CryptoWrapper, JwtDecodeWrapper, MonitoringService, LoggerService,
  {provide: ErrorHandler, useClass: DefaultErrorHandler}]
})



export class OrganisationModule {

}
