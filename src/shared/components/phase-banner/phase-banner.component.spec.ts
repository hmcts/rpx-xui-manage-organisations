import { NO_ERRORS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExuiCommonLibModule, FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { RpxLanguage, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { PhaseBannerComponent } from './phase-banner.component';

@Pipe({
  name: 'rpxTranslate',
  standalone: false
})
class RpxTranslateMockPipe implements PipeTransform {
  public transform(value: string): string {
    return value;
  }
}

class MockTranslationService {
  private currentLanguage: RpxLanguage = 'en';

  public get language(): RpxLanguage {
    return this.currentLanguage;
  }

  public set language(language: RpxLanguage) {
    this.currentLanguage = language;
  }
}

describe('PhaseBannerComponent', () => {
  let component: PhaseBannerComponent;
  let fixture: ComponentFixture<PhaseBannerComponent>;
  let featureToggleService: jasmine.SpyObj<FeatureToggleService>;
  let translationService: MockTranslationService;

  beforeEach(async () => {
    featureToggleService = jasmine.createSpyObj<FeatureToggleService>('FeatureToggleService', ['isEnabled']);

    await TestBed.configureTestingModule({
      declarations: [PhaseBannerComponent, RpxTranslateMockPipe],
      imports: [ExuiCommonLibModule],
      providers: [
        { provide: FeatureToggleService, useValue: featureToggleService },
        { provide: RpxTranslationService, useClass: MockTranslationService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  const createComponent = (welshLanguageEnabled: boolean): void => {
    featureToggleService.isEnabled.and.returnValue(of(welshLanguageEnabled));
    fixture = TestBed.createComponent(PhaseBannerComponent);
    component = fixture.componentInstance;
    translationService = TestBed.inject(RpxTranslationService) as unknown as MockTranslationService;
    fixture.detectChanges();
  };

  it('shows the Cymraeg toggle when the mo-welsh-language flag is enabled', () => {
    createComponent(true);

    const toggle = fixture.nativeElement.querySelector('button.language') as HTMLButtonElement;

    expect(toggle).not.toBeNull();
    expect(toggle.textContent.trim()).toBe('Cymraeg');
  });

  it('does not render the toggle when the mo-welsh-language flag is disabled', () => {
    createComponent(false);

    expect(fixture.nativeElement.querySelector('button.language')).toBeNull();
  });

  it('switches between Welsh and English when the toggle is clicked', () => {
    createComponent(true);

    const toggle = (): HTMLButtonElement => fixture.nativeElement.querySelector('button.language') as HTMLButtonElement;

    toggle().click();
    fixture.detectChanges();
    expect(translationService.language).toBe('cy');
    expect(toggle().textContent.trim()).toBe('English');

    toggle().click();
    fixture.detectChanges();
    expect(translationService.language).toBe('en');
    expect(toggle().textContent.trim()).toBe('Cymraeg');
  });
});
