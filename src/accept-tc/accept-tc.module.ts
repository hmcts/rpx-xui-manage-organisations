import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { SharedModule } from '../shared/shared.module';
// containers
import * as fromContainers from './containers';
import { AcceptTcWrapperComponent } from './containers/accept-tc-wrapper.component';
// services
import * as fromServices from './services';
import { effects, reducers } from './store';

const ROUTES = [
  {
    path: '',
    component: AcceptTcWrapperComponent,
    canActivate: [HealthCheckGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    StoreModule.forFeature('acceptTc', reducers),
    EffectsModule.forFeature(effects),
    FormsModule,
    ExuiCommonLibModule.forChild()
  ],
  exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers],
  providers: [...fromServices.services]
})

/**
 * Entry point to AcceptTandC
 */
export class AcceptTcModule {}
