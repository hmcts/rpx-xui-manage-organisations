import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GovUiModule } from '../../projects/gov-ui/src/public_api';
import { AcceptTermsAndConditionGuard } from '../accept-tc/guards/acceptTermsAndCondition.guard';
import { TermsConditionGuard } from '../app/guards/termsCondition.guard';
import { AbstractAppInsights, AppInsightsWrapper } from '../shared/services/appInsightsWrapper';
import { FeatureToggleEditUserGuard } from '../users/guards/feature-toggle-edit-user.guard';
import { HmctsErrorSummaryComponent } from './components/hmcts-error-summary/hmcts-error-summary.component';
import { HmctsMainWrapperComponent } from './components/hmcts-main-wrapper/hmcts-main-wrapper.component';
import { PhaseBannerComponent } from './components/phase-banner/phase-banner.component';
import { SuccessNotificationComponent } from './components/success-notification/success-notification.component';
import { HealthCheckGuard } from './guards/health-check.guard';
import { LoaderModule } from './modules/loader/loader.module';
import { AuthIntercepterServer } from './services/auth-interceptor.service';
import { HeadersService } from './services/headers.service';
import { HealthCheckService } from './services/health-check.service';
import { HttpIntercepterServer } from './services/http-interceptor.service';
import { MonitoringService } from './services/monitoring.service';

@NgModule({
  declarations: [
    HmctsMainWrapperComponent,
    HmctsErrorSummaryComponent,
    SuccessNotificationComponent
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
    SuccessNotificationComponent
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
    TermsConditionGuard,
    AcceptTermsAndConditionGuard,
    FeatureToggleEditUserGuard
  ]
})
export class SharedModule {
}
