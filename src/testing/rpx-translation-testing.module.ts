import { NgModule, Pipe, PipeTransform } from '@angular/core';
import { RpxTranslationService } from 'rpx-xui-translation';

@Pipe({ name: 'rpxTranslate', standalone: false })
export class RpxTranslateTestingPipe implements PipeTransform {
  transform<T = string>(value: T): T | null {
    return value ?? null;
  }
}

@NgModule({
  declarations: [RpxTranslateTestingPipe],
  exports: [RpxTranslateTestingPipe],
  providers: [
    { provide: RpxTranslationService, useValue: { language: 'en' } }
  ]
})
export class RpxTranslationTestingModule {}
