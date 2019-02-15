import { NgModule } from '@angular/core'
import {GovUiModule} from '../../projects/gov-ui/src/lib/gov-ui.module';
import {HttpIntercepterServer} from './http-interceptor.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {HeadersService} from './headers.service';

@NgModule( {
  exports: [GovUiModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpIntercepterServer,
      multi: true
    },
    HeadersService
  ]
})
export class SharedModule {
}
