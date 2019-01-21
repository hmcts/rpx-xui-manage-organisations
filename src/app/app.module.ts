import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './containers/app/app.component';
import {RegisterModule} from '../register/register.module';
import {SharedModule} from './shared/shared.module';

// ngrx
import {MetaReducer, StoreModule} from '@ngrx/store';
import {storeFreeze} from 'ngrx-store-freeze';
import {EffectsModule} from '@ngrx/effects';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {RouterStateSerializer, StoreRouterConnectingModule} from '@ngrx/router-store';
import {effects} from './store/effects';
import {CustomSerializer, reducers} from './store/reducers';

// from Containers
import * as fromContainers from './containers/';

// from Components
import * as fromComponents from './components';

import {environment} from '../environments/environment';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/register' },
  { path: '**', redirectTo: '/register' }
];
export const metaReducers: MetaReducer<any>[] = !environment.production
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
    RouterModule.forRoot(ROUTES),
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot(effects),
    RegisterModule,
    SharedModule,
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      logOnly: environment.production
    }),
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
