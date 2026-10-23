import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RpxTranslationModule } from 'rpx-xui-translation';
import { LoaderComponent } from './components/loader.component';
import { LoaderInterceptorService } from './services/loader-interceptor.service';

@NgModule({
  declarations: [
    LoaderComponent
  ],
  imports: [
    CommonModule,
    RpxTranslationModule.forChild()
  ],
  exports: [
    LoaderComponent
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    }
  ]
})
export class LoaderModule {}
