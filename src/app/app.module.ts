import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { AppComponent } from './containers/app/app.component';
import { UsersModule } from '../users/users.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { SharedModule } from './shared/shared.module';

import { CookieModule } from 'ngx-cookie';

// ngrx
import { MetaReducer, StoreModule } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { RouterStateSerializer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { effects } from './store/effects';
import { CustomSerializer, reducers } from './store/reducers';

// from Containers
import * as fromContainers from './containers/';

// from Components
import * as fromComponents from './components';

import config from '../../api/lib/config';
import { OrganisationComponent } from 'src/organisation/containers';
import { FeeAccountsModule } from 'src/fee-accounts/fee-accounts.module';
import { ROUTES } from './app.routes';

import { GovUiModule } from '../../projects/gov-ui/src/lib/gov-ui.module';
import {AuthService} from '../auth/auth.service';


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
    CookieModule.forRoot(),
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    UsersModule,
    OrganisationModule,
    SharedModule,
    GovUiModule,
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      logOnly: config.production
    }),
    FeeAccountsModule
  ],
  providers: [
    AuthService,
    { provide: RouterStateSerializer, useClass: CustomSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
