import { LoaderModule } from './../shared/modules/loader/loader.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AppComponent } from './containers/app/app.component';
import { SharedModule } from '../shared/shared.module';
import { CookieModule } from 'ngx-cookie';

// ngrx
import { MetaReducer, StoreModule } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { effects } from './store/effects';
import { CustomSerializer, reducers } from './store/';

// from Containers
import * as fromContainers from './containers/';

// from Components
import * as fromComponents from './components';

import { ROUTES } from './app.routes';

import { UserProfileModule } from '../user-profile/user-profile.module';
import config from '../../api/lib/config';
import {UserService} from '../user-profile/services/user.service';
import {HttpClientModule} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { DefaultErrorHandler } from 'src/shared/errorHandler/defaultErrorHandler';
import { LoggerService } from 'src/shared/services/logger.service';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { JurisdictionService } from 'src/users/services';
import { CryptoWrapper } from 'src/shared/services/cryptoWrapper';
import { JwtDecodeWrapper } from 'src/shared/services/jwtDecodeWrapper';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';

export const metaReducers: MetaReducer<any>[] = !config.production
  ? [storeFreeze]
  : [];


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
    ExuiCommonLibModule.forRoot({launchDarklyKey: ''})
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    UserService, {provide: ErrorHandler, useClass: DefaultErrorHandler},
    CryptoWrapper, JwtDecodeWrapper, LoggerService, JurisdictionService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
