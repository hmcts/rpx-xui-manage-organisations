import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// services
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
// containers
import * as fromComponents from './components';
// containers
import * as fromContainers from './containers';
import { InviteUserSuccessGuard } from './guards/invite-user-success.guard';
import * as fromServices from './services';
import { effects, reducers } from './store';
import { usersRouting } from './users.routing';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    usersRouting,
    SharedModule,
    StoreModule.forFeature('users', reducers),
    EffectsModule.forFeature(effects),
    FormsModule,
    ExuiCommonLibModule.forChild()
  ],
  exports: [...fromContainers.containers, ...fromComponents.components],
  declarations: [...fromContainers.containers,  ...fromComponents.components],
  providers: [...fromServices.services, InviteUserSuccessGuard]
})

/**
 * Entry point to UsersModule
 */

export class UsersModule {}
