import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule, inject, provideAppInitializer } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CookieService, ExuiCommonLibModule, FeatureToggleGuard, FeatureToggleService, GoogleAnalyticsService, LaunchDarklyService, ManageSessionServices } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
// ngrx
import { MetaReducer, Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { CookieModule } from 'ngx-cookie';
import { LoggerModule, NGXLogger, NgxLoggerLevel } from 'ngx-logger';
import { environment } from '../environments/environment';
import { EnvironmentConfig } from '../models/environmentConfig.model';
import { DefaultErrorHandler } from '../shared/errorHandler/defaultErrorHandler';
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
import { HealthCheckService } from '../shared/services/health-check.service';
import { MonitoringService } from '../shared/services/monitoring.service';
import { FeatureToggleEditUserGuard } from '../users/guards/feature-toggle-edit-user.guard';
import { TermsConditionGuard } from './guards/termsCondition.guard';
import { OrganisationModule } from 'src/organisation/organisation.module';

// storeFreeze replaced by NgRx runtimeChecks in v20+; keep metaReducers empty.
export const metaReducers: MetaReducer<any>[] = [];

export function launchDarklyClientIdFactory(envConfig: EnvironmentConfig): string {
  return envConfig.launchDarklyClientId || '';
}

@NgModule({ declarations: [
  AppComponent,
  ...fromComponents.components,
  ...fromContainers.containers
],
bootstrap: [AppComponent],
schemas: [CUSTOM_ELEMENTS_SCHEMA], imports: [BrowserModule,
  CookieModule.forRoot(),
  RouterModule.forRoot(ROUTES, {
    anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled', onSameUrlNavigation: 'reload'
  }),
  SharedModule,
  StoreModule.forRoot(reducers, {
    metaReducers,
    runtimeChecks: !environment.production ? {
      strictStateImmutability: true,
      strictActionImmutability: true,
      // Serializability checks disabled due to existing non-serializable values (e.g. router state, complex lib objects)
      strictStateSerializability: false,
      strictActionSerializability: false,
      strictActionWithinNgZone: true,
      strictActionTypeUniqueness: true
    } : {}
  }),
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
  })], providers: [
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
  JwtDecodeWrapper, LoggerService, JurisdictionService,
  { provide: FeatureToggleService, useClass: LaunchDarklyService },
  // Application initializer: obtain Store via DI injection utility and pass to initApplication, which returns a function we invoke.
  provideAppInitializer(() => {
    const store = inject(Store);
    const initializerFn = initApplication(store);
    return initializerFn();
  }),
  provideHttpClient(withInterceptorsFromDi())
] })
export class AppModule {}
