import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './containers/app/app.component';
import { UsersModule } from '../users/users.module';
import { OrganisationModule } from '../organisation/organisation.module';
import { SharedModule } from './shared/shared.module';

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

import { environment } from '../environments/environment';
import { OrganisationComponent } from 'src/organisation/containers';
import { LoginModule } from 'src/login/login.module';
import { PaymentsModule } from 'src/fee-accounts/payments.module';

export const ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login' },
  { path: '**', redirectTo: '/login' }
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
    UsersModule,
    OrganisationModule,
    SharedModule,
    StoreRouterConnectingModule,
    StoreDevtoolsModule.instrument({
      logOnly: environment.production
    }),
    LoginModule,
    PaymentsModule
  ],
  providers: [{ provide: RouterStateSerializer, useClass: CustomSerializer }],
  bootstrap: [AppComponent]
})
export class AppModule { }
