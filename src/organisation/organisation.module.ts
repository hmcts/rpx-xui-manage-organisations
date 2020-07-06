import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DefaultErrorHandler } from 'src/shared/errorHandler/defaultErrorHandler';
import { AbstractAppInsights, AppInsightsWrapper } from 'src/shared/services/appInsightsWrapper';
import { CryptoWrapper } from 'src/shared/services/cryptoWrapper';
import { JwtDecodeWrapper } from 'src/shared/services/jwtDecodeWrapper';
import { LoggerService } from '../shared/services/logger.service';
import { MonitoringService } from '../shared/services/monitoring.service';
import { SharedModule } from '../shared/shared.module';
// containers
import * as fromContainers from './containers';
import { OrganisationGuard } from './guards/organisation.guard';
import { organisationRouting } from './organisation.routing';
// services
import * as fromServices from './services';
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
    }),
    ExuiCommonLibModule.forChild()
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
