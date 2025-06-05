import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { HealthCheckGuard } from '../shared/guards/health-check.guard';
import { SharedModule } from '../shared/shared.module';
import { AcceptTcWrapperComponent } from './containers/accept-tc-wrapper.component';
import { effects, reducers } from './store';

// containers
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import * as fromContainers from './containers';
// services
import * as fromServices from './services';

const ROUTES = [
  {
    path: '',
    component: AcceptTcWrapperComponent,
    canActivate: [HealthCheckGuard]
  }
];

@NgModule({ exports: [...fromContainers.containers],
  declarations: [...fromContainers.containers], imports: [CommonModule,
    RouterModule.forChild(ROUTES),
    SharedModule,
    StoreModule.forFeature('acceptTc', reducers),
    EffectsModule.forFeature(effects),
    FormsModule,
    ExuiCommonLibModule], providers: [...fromServices.services, provideHttpClient(withInterceptorsFromDi())] })

/**
 * Entry point to AcceptTandC
 */
export class AcceptTcModule {}
