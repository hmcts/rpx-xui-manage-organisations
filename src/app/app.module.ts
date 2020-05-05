import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
// ngrx
import { MetaReducer, StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { storeFreeze } from 'ngrx-store-freeze';
import { CookieModule } from 'ngx-cookie';
import { LoggerModule, NgxLoggerLevel } from 'ngx-logger';
import { environment } from 'src/environments/environment';
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
import { ROUTES } from './app.routes';
// from Components
import * as fromComponents from './components';
// from Containers
import * as fromContainers from './containers/';
import { AppComponent } from './containers/app/app.component';
import { CustomSerializer, reducers } from './store/';
import { effects } from './store/effects';
import {TermsConditionGuard} from './guards/termsCondition.guard';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';

import {NgIdleKeepaliveModule} from '@ng-idle/keepalive';

// TODO: Add this later
// import {LogOutKeepAliveService} from './services/keep-alive/keep-alive.service';

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
    ExuiCommonLibModule.forRoot(),
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    UserService, {provide: ErrorHandler, useClass: DefaultErrorHandler},
    CryptoWrapper, JwtDecodeWrapper, LoggerService, JurisdictionService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
