import { NgModule } from '@angular/core'
import {GovUiModule} from '../../projects/gov-ui/src/lib/gov-ui.module';
import {HttpIntercepterServer} from './http-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeadersService} from './headers.service';
import {AuthIntercepterServer} from './auth-interceptor.service';
import {ReactiveFormsModule} from '@angular/forms';
import {RemoveHostDirective} from '../app/directives/remove-host.directive';

@NgModule( {
  imports: [
    ReactiveFormsModule,
    GovUiModule
  ],
  exports: [
    ReactiveFormsModule,
    GovUiModule,
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
