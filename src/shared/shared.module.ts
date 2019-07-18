import { NgModule } from '@angular/core';
import { GovUiModule } from 'projects/gov-ui/src/public_api';
import { HttpInterceptorServer } from './services/http-interceptor.service';
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
    GovUiModule
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
      useClass: HttpInterceptorServer,
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
    HealthCheckService
  ]
})
export class SharedModule {
}
