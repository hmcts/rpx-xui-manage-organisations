import { CUSTOM_ELEMENTS_SCHEMA, Pipe, PipeTransform } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ExuiCommonLibModule, FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { StoreModule } from '@ngrx/store';
import { RpxLanguage, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { reducers } from 'src/app/store/reducers';
import { HeaderComponent } from './header.component';

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

describe('HeaderComponent', () => {
  let fixture: ComponentFixture<HeaderComponent>;
  let app: HeaderComponent;
  let featureToggleService: jasmine.SpyObj<FeatureToggleService>;
  let translationService: MockTranslationService;

  beforeEach(waitForAsync(() => {
    featureToggleService = jasmine.createSpyObj<FeatureToggleService>('FeatureToggleService', ['isEnabled']);

    return TestBed.configureTestingModule({
      imports: [
        ExuiCommonLibModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature('app', reducers)
      ],
      declarations: [HeaderComponent, RpxTranslateMockPipe],
      providers: [
        { provide: FeatureToggleService, useValue: featureToggleService },
        { provide: RpxTranslationService, useClass: MockTranslationService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(HeaderComponent);
      app = fixture.componentInstance;
      translationService = TestBed.inject(RpxTranslationService) as unknown as MockTranslationService;
    });
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should emit navigate event', () => {
    spyOn(app.navigate, 'emit');
    app.onNavigate('dummy');
    expect(app.navigate.emit).toHaveBeenCalledWith('dummy');
  });

  it('shows the Cymraeg toggle when the mo-welsh-language flag is enabled', () => {
    featureToggleService.isEnabled.and.returnValue(of(true));
    fixture.detectChanges();

    const toggle = fixture.nativeElement.querySelector('button.language') as HTMLButtonElement;

    expect(toggle).not.toBeNull();
    expect(toggle.textContent.trim()).toBe('Cymraeg');
  });

  it('does not render the toggle when the mo-welsh-language flag is disabled', () => {
    featureToggleService.isEnabled.and.returnValue(of(false));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button.language')).toBeNull();
  });

  it('switches between Welsh and English when the toggle is clicked', () => {
    featureToggleService.isEnabled.and.returnValue(of(true));
    fixture.detectChanges();

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
