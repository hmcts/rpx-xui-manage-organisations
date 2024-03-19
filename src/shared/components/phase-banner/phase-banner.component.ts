import { Component, Input } from '@angular/core';
import { RpxLanguage, RpxTranslationService } from 'rpx-xui-translation';
import { SessionStorageService } from 'src/shared/services/session-storage.service';
import * as fromAppStore from '../../../app/store';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-phase-banner',
  templateUrl: './phase-banner.component.html'
})
export class PhaseBannerComponent {
  @Input() public type: string;
  public noBanner: boolean;
  private readonly noBannerSessionKey = 'noBanner';
  welshLanguageEnabled$: Observable<boolean>;

  public get currentLang() {
    return this.langService.language;
  }

  constructor(private readonly langService: RpxTranslationService,
              private readonly sessionStorageService: SessionStorageService,
              private readonly appStore: Store<fromAppStore.State>) { }

  public ngOnInit(): void {
    this.welshLanguageEnabled$ = this.appStore.pipe(select(fromAppStore.getWelshLanguageFeatureIsEnabled));
    this.noBanner = (this.currentLang === 'cy' ? true : false);
    if (!this.noBanner) {
      this.noBanner = JSON.parse(this.sessionStorageService.getItem(this.noBannerSessionKey));
    }
  }

  public toggleLanguage(lang: RpxLanguage): void {
    this.noBanner = (lang === 'cy');
    this.langService.language = lang;
  }

  public closeBanner() {
    this.noBanner = false;
    this.sessionStorageService.setItem(this.noBannerSessionKey, 'false');
  }
}
