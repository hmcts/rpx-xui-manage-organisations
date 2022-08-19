import { ErrorHandler, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { organisationRouting } from './organisation.routing';

// containers
import * as fromContainers from './containers';

// services
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromServices from './services';

import { HttpClientModule } from '@angular/common/http';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DefaultErrorHandler } from 'src/shared/errorHandler/defaultErrorHandler';
import { AbstractAppInsights, AppInsightsWrapper } from 'src/shared/services/appInsightsWrapper';
import { CryptoWrapper } from 'src/shared/services/cryptoWrapper';
import { JwtDecodeWrapper } from 'src/shared/services/jwtDecodeWrapper';
import { LoggerService } from '../shared/services/logger.service';
import { MonitoringService } from '../shared/services/monitoring.service';
import { OrganisationGuard } from './guards/organisation.guard';
import { effects, reducers } from './store';

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
    })
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services, OrganisationGuard,
  { provide: AbstractAppInsights, useClass: AppInsightsWrapper},
  CryptoWrapper, JwtDecodeWrapper, MonitoringService, LoggerService,
  {provide: ErrorHandler, useClass: DefaultErrorHandler}]
})

export class OrganisationModule {}
