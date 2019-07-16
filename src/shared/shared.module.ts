import { NgModule } from '@angular/core';
import {HttpIntercepterServer} from './services/http-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeadersService} from './services/headers.service';
import {AuthIntercepterServer} from './services/auth-interceptor.service';
import {ReactiveFormsModule} from '@angular/forms';
import { HmctsMainWrapperComponent } from './components/hmcts-main-wrapper/hmcts-main-wrapper.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HmctsErrorSummaryComponent } from './components/hmcts-error-summary/hmcts-error-summary.component';
import { GovUiModule } from 'projects/gov-ui/src/public_api';

@NgModule( {
  declarations: [
    HmctsMainWrapperComponent,
    HmctsErrorSummaryComponent
  ],
  imports: [
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    GovUiModule
  ],
  exports: [
    ReactiveFormsModule,
    HmctsMainWrapperComponent,
    GovUiModule
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
    HeadersService
  ]
})
export class SharedModule {
}
