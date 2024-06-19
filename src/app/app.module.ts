import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CookieService, ExuiCommonLibModule, FeatureToggleGuard, FeatureToggleService, GoogleAnalyticsService, LaunchDarklyService, ManageSessionServices } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
// ngrx
import { MetaReducer, Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { CookieModule } from 'ngx-cookie';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import config from '../../api/lib/config';
import { environment } from '../environments/environment';
import { EnvironmentConfig } from '../models/environmentConfig.model';
import { DefaultErrorHandler } from '../shared/errorHandler/defaultErrorHandler';
import { CryptoWrapper } from '../shared/services/cryptoWrapper';
import { JwtDecodeWrapper } from '../shared/services/jwtDecodeWrapper';
import { LoggerService } from '../shared/services/logger.service';
import { UserService } from '../user-profile/services/user.service';
import { UserProfileModule } from '../user-profile/user-profile.module';
import { JurisdictionService } from '../users/services';
import { LoaderModule } from './../shared/modules/loader/loader.module';
import { initApplication } from './app-initializer';
import { ROUTES } from './app.routes';
// from Components
import * as fromComponents from './components';
// from Containers
import * as fromContainers from './containers/';
import { AppComponent } from './containers/app/app.component';
import { CustomSerializer, reducers } from './store/';
import { effects } from './store/effects';

import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { SharedModule } from 'src/shared/shared.module';
import { GovUiModule } from '../../projects/gov-ui/src/public_api';
import { AcceptTermsAndConditionGuard } from '../accept-tc/guards/acceptTermsAndCondition.guard';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { EnvironmentService } from '../shared/services/environment.service';
import { HealthCheckService } from '../shared/services/health-check.service';
import { MonitoringService } from '../shared/services/monitoring.service';
import { FeatureToggleEditUserGuard } from '../users/guards/feature-toggle-edit-user.guard';
import { TermsConditionGuard } from './guards/termsCondition.guard';
import { OrganisationModule } from 'src/organisation/organisation.module';

export const metaReducers: MetaReducer<any>[] = !config.production
  ? [storeFreeze]
  : [];

export function launchDarklyClientIdFactory(envConfig: EnvironmentConfig): string {
  return envConfig.launchDarklyClientId || '';
}

@NgModule({
  declarations: [
    AppComponent,
    ...fromComponents.components,
    ...fromContainers.containers
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(ROUTES, {
      anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload'
    }),
    SharedModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    UserProfileModule,
    OrganisationModule,
    StoreRouterConnectingModule.forRoot(),
    !environment.production ? StoreDevtoolsModule.instrument({ logOnly: true }) : [],
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      disableConsoleLogging: false
    }),
    LoaderModule,
    GovUiModule,
    ExuiCommonLibModule,
    NgIdleKeepaliveModule.forRoot(),
    NoopAnimationsModule,
    RpxTranslationModule.forRoot({
      baseUrl: '/api/translation',
      debounceTimeMs: 300,
      validity: {
        days: 1
      },
      testMode: false
    })
  ],
  providers: [
    NGXLogger,
    CookieService,
    GoogleAnalyticsService,
    HealthCheckGuard,
    HealthCheckService,
    ManageSessionServices,
    MonitoringService,
    TermsConditionGuard,
    AcceptTermsAndConditionGuard,
    FeatureToggleEditUserGuard,
    FeatureToggleGuard,
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    UserService, { provide: ErrorHandler, useClass: DefaultErrorHandler },
    CryptoWrapper, JwtDecodeWrapper, LoggerService, JurisdictionService,
    { provide: FeatureToggleService, useClass: LaunchDarklyService },
    { provide: APP_INITIALIZER, useFactory: initApplication, deps: [Store, EnvironmentService], multi: true }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
