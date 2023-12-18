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
import { OrganisationAccessPermissionsComponent } from './components/organisation-access-permissions/organisation-access-permissions.component';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    usersRouting,
    SharedModule,
    StoreModule.forFeature('users', reducers),
    EffectsModule.forFeature(effects),
    FormsModule,
    ExuiCommonLibModule
  ],
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [...fromContainers.containers, ...fromComponents.components, OrganisationAccessPermissionsComponent],
  providers: [...fromServices.services, InviteUserSuccessGuard]
})

/**
 * Entry point to UsersModule
 */

export class UsersModule {}
