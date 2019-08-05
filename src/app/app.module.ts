import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { FeeAccountsModule } from 'src/fee-accounts/fee-accounts.module';

import config from '../../api/lib/config';
import {OrganisationModule} from '../organisation/organisation.module';
import {UserService} from '../user-profile/services/user.service';
import {HttpClientModule} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { JurisdictionService } from 'src/users/services';

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
    !environment.production ? StoreDevtoolsModule.instrument({logOnly: true}) : []
  ],
  providers: [
    { provide: RouterStateSerializer, useClass: CustomSerializer },
    UserService, JurisdictionService
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
