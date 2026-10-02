import { Component, Input } from '@angular/core';
import { RpxLanguage, RpxTranslationService } from 'rpx-xui-translation';

@Component({
  selector: 'app-phase-banner',
  templateUrl: './phase-banner.component.html',
  standalone: false
})
export class PhaseBannerComponent {
  @Input() public type: string;

  public get currentLang(): RpxLanguage {
    return this.langService.language;
  }

  constructor(private readonly langService: RpxTranslationService) {}

  public toggleLanguage(lang: RpxLanguage): void {
    this.langService.language = lang;
  }
}
