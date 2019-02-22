import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { usersRouting } from './users.routing';
import { SharedModule } from '../shared/shared.module';
import { FormsModule } from '@angular/forms';
// containers
import * as fromContainers from './containers';

// services
import * as fromServices from './services';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { reducers, userformreducers, effects } from './store';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    usersRouting,
    SharedModule,
    StoreModule.forFeature('users', reducers),
    StoreModule.forFeature('userform', userformreducers),
    EffectsModule.forFeature(effects),
    FormsModule
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services]
})

/**
 * Entry point to UsersModule
 */

export class UsersModule {

}
