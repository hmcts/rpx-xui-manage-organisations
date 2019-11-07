import { NgModule } from '@angular/core';
import { GovUiModule } from 'projects/gov-ui/src/public_api';
import { HttpIntercepterServer } from './services/http-interceptor.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HeadersService } from './services/headers.service';
import { AuthIntercepterServer } from './services/auth-interceptor.service';
import { ReactiveFormsModule } from '@angular/forms';
import { MonitoringService } from './services/monitoring.service';
import { HmctsMainWrapperComponent } from './components/hmcts-main-wrapper/hmcts-main-wrapper.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HmctsErrorSummaryComponent } from './components/hmcts-error-summary/hmcts-error-summary.component';
import { SuccessNotificationComponent } from './components/success-notification/success-notification.component';
import { AbstractAppInsights, AppInsightsWrapper } from '../shared/services/appInsightsWrapper';
import { HealthCheckGuard } from './guards/health-check.guard';
import { HealthCheckService } from './services/health-check.service';
import { PhaseBannerComponent } from './components/phase-banner/phase-banner.component';
import { LoaderModule } from './modules/loader/loader.module';
import {TermsConditionGuard} from '../app/guards/termsCondition.guard';

@NgModule({
  declarations: [
    HmctsMainWrapperComponent,
    HmctsErrorSummaryComponent,
    SuccessNotificationComponent,
    PhaseBannerComponent
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    GovUiModule,
    LoaderModule
  ],
  exports: [
    ReactiveFormsModule,
    GovUiModule,
    HmctsMainWrapperComponent,
    SuccessNotificationComponent,
    PhaseBannerComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercepterServer,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthIntercepterServer,
      multi: true
    },
    HeadersService,
    { provide: AbstractAppInsights, useClass: AppInsightsWrapper},
    MonitoringService,
    HealthCheckGuard,
    HealthCheckService,
    TermsConditionGuard
  ]
})
export class SharedModule {
}
