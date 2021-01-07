import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { ExuiCommonLibModule, LAUNCHDARKLYKEY } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
// ngrx
import { MetaReducer, Store, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { CookieModule } from 'ngx-cookie';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from 'src/models/environmentConfig.model';
import { DefaultErrorHandler } from 'src/shared/errorHandler/defaultErrorHandler';
import { CryptoWrapper } from 'src/shared/services/cryptoWrapper';
import { JwtDecodeWrapper } from 'src/shared/services/jwtDecodeWrapper';
import { LoggerService } from 'src/shared/services/logger.service';
import { JurisdictionService } from 'src/users/services';
import config from '../../api/lib/config';
import { SharedModule } from '../shared/shared.module';
import { UserService } from '../user-profile/services/user.service';
import { UserProfileModule } from '../user-profile/user-profile.module';
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

import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';

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
    ...fromContainers.containers,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    CookieModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    SharedModule,
    UserProfileModule,
    StoreRouterConnectingModule,
    !environment.production ? StoreDevtoolsModule.instrument({logOnly: true}) : [],
    LoggerModule.forRoot({
      level: NgxLoggerLevel.TRACE,
      disableConsoleLogging: false
    }),
    LoaderModule,
    ExuiCommonLibModule.forRoot(),
    NgIdleKeepaliveModule.forRoot(),
    NoopAnimationsModule
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    UserService, {provide: ErrorHandler, useClass: DefaultErrorHandler},
    CryptoWrapper, JwtDecodeWrapper, LoggerService, JurisdictionService,
    { provide: LAUNCHDARKLYKEY, useFactory: launchDarklyClientIdFactory, deps: [ENVIRONMENT_CONFIG] },
    { provide: APP_INITIALIZER, useFactory: initApplication, deps: [Store], multi: true },
    ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
