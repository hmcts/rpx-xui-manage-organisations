import { ErrorHandler, NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { organisationRouting } from './organisation.routing';

// containers
import * as fromContainers from './containers';

// components
import * as fromComponent from './components';

// services
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromServices from './services';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RxReactiveFormsModule } from '@rxweb/reactive-form-validators';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { DefaultErrorHandler } from '../shared/errorHandler/defaultErrorHandler';
import { JwtDecodeWrapper } from '../shared/services/jwtDecodeWrapper';
import { LoggerService } from '../shared/services/logger.service';
import { MonitoringService } from '../shared/services/monitoring.service';
import { OrganisationGuard } from './guards/organisation.guard';
import { effects, reducers } from './store';

@NgModule({ exports: [...fromContainers.containers, ...fromComponent.components],
  declarations: [...fromContainers.containers, ...fromComponent.components], imports: [CommonModule,
    organisationRouting,
    SharedModule,
    StoreModule.forFeature('org', reducers),
    EffectsModule.forFeature(effects),
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      disableConsoleLogging: false
    }),
    ExuiCommonLibModule,
    RxReactiveFormsModule], providers: [...fromServices.services, OrganisationGuard,
    JwtDecodeWrapper, MonitoringService, LoggerService,
    { provide: ErrorHandler, useClass: DefaultErrorHandler }, provideHttpClient(withInterceptorsFromDi())] })

export class OrganisationModule {}
