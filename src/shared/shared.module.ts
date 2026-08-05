import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GovUiModule } from 'projects/gov-ui/src/public_api';
import { AcceptTermsAndConditionGuard } from 'src/accept-tc/guards/acceptTermsAndCondition.guard';
import { FeatureToggleEditUserGuard } from 'src/users/guards/feature-toggle-edit-user.guard';

import { TermsConditionGuard } from '../app/guards/termsCondition.guard';
import { HmctsErrorSummaryComponent } from './components/hmcts-error-summary/hmcts-error-summary.component';
import { HmctsMainWrapperComponent } from './components/hmcts-main-wrapper/hmcts-main-wrapper.component';
import { SuccessIconComponent } from './components/icons/success-icon.component';
import { WarningIconComponent } from './components/icons/warning-icon.component';
import { PhaseBannerComponent } from './components/phase-banner/phase-banner.component';
import { SuccessNotificationComponent } from './components/success-notification/success-notification.component';
import { HealthCheckGuard } from './guards/health-check.guard';
import { UserRoleGuard } from './guards/user-role.guard';
import { LoaderModule } from './modules/loader/loader.module';
import { AuthIntercepterServer } from './services/auth-interceptor.service';
import { HeadersService } from './services/headers.service';
import { HealthCheckService } from './services/health-check.service';
import { HttpIntercepterServer } from './services/http-interceptor.service';
import { MonitoringService } from './services/monitoring.service';
import { RpxTranslationModule } from 'rpx-xui-translation';

@NgModule({
  declarations: [
    HmctsMainWrapperComponent,
    HmctsErrorSummaryComponent,
    PhaseBannerComponent,
    SuccessNotificationComponent,
    SuccessIconComponent,
    WarningIconComponent
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    GovUiModule,
    LoaderModule,
    RpxTranslationModule.forChild()
  ],
  exports: [
    GovUiModule,
    HmctsMainWrapperComponent,
    PhaseBannerComponent,
    ReactiveFormsModule,
    SuccessIconComponent,
    SuccessNotificationComponent,
    WarningIconComponent,
    HmctsErrorSummaryComponent
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
    MonitoringService,
    UserRoleGuard,
    HealthCheckGuard,
    HealthCheckService,
    TermsConditionGuard,
    AcceptTermsAndConditionGuard,
    FeatureToggleEditUserGuard
  ]
})
export class SharedModule {}
