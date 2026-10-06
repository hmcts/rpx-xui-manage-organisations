import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { ExuiCommonLibModule, FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { StoreModule } from '@ngrx/store';
import { RpxTranslationModule, RpxTranslationService } from 'rpx-xui-translation';
import { of } from 'rxjs';
import { reducers } from 'src/app/store/reducers';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let fixture;
  let app;
  let featureToggleService: jasmine.SpyObj<FeatureToggleService>;

  beforeEach(waitForAsync(() => {
    featureToggleService = jasmine.createSpyObj<FeatureToggleService>('FeatureToggleService', ['isEnabled']);
    featureToggleService.isEnabled.and.returnValue(of(false));

    TestBed.configureTestingModule({
      imports: [
        ExuiCommonLibModule,
        RpxTranslationModule.forChild(),
        StoreModule.forRoot({}),
        StoreModule.forFeature('app', reducers)
      ],
      declarations: [
        HeaderComponent
      ],
      providers: [
        { provide: FeatureToggleService, useValue: featureToggleService },
        { provide: RpxTranslationService, useValue: { language: 'en' } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(HeaderComponent);
    app = fixture.debugElement.componentInstance;
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should emit navigate event', () => {
    spyOn(app.navigate, 'emit');
    app.onNavigate('dummy');
    expect(app.navigate.emit).toHaveBeenCalledWith('dummy');
  });
});
