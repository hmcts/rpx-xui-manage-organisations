import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { effects, reducers } from './store';
import { usersRouting } from './users.routing';

// containers

import * as fromContainers from './containers';
// containers

import * as fromComponents from './components';
// services

import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { InviteUserSuccessGuard } from './guards/invite-user-success.guard';
import * as fromServices from './services';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { NgxPaginationModule } from 'ngx-pagination';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { ManageUserFailureComponent } from './containers/manage-user-failure/manage-user-failure.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    usersRouting,
    SharedModule,
    StoreModule.forFeature('users', reducers),
    EffectsModule.forFeature(effects),
    FormsModule,
    ExuiCommonLibModule,
    MatAutocompleteModule,
    NgxPaginationModule,
    RpxTranslationModule.forChild()
  ],
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [
    ...fromContainers.containers,
    ...fromComponents.components
  ],
  providers: [...fromServices.services, InviteUserSuccessGuard]
})

/**
 * Entry point to UsersModule
 */
export class UsersModule {}
