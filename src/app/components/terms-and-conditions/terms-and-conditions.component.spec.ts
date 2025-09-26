import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TermsConditionsService } from '../../../shared/services/termsConditions.service';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

const storeMock = {
  pipe: () => of(null),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}
};
let pipeSpy: jasmine.Spy;
let dispatchSpy: jasmine.Spy;

describe('TermsAndConditionsComponent', () => {
  @Component({
    selector: 'app-exui-app-host-dummy-component',
    template: '<exui-terms-and-conditions></exui-terms-and-conditions>'
  })
  class TestDummyHostComponent {
    @ViewChild(TermsAndConditionsComponent, { static: true })
    public footerComponent: TermsAndConditionsComponent;
  }

  let testHostComponent: TestDummyHostComponent;
  let testHostFixture: ComponentFixture<TestDummyHostComponent>;
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;
  let element: DebugElement;
  let termsConditionsService: TermsConditionsService;
  const featureToggleServiceMock = jasmine.createSpyObj('FeatureToggleService', ['getValue']);
  const routerMock = {
    navigate: jasmine.createSpy().and.returnValue(Promise.resolve(true))
  };

  beforeEach(waitForAsync(() => {
    pipeSpy = spyOn(storeMock, 'pipe');
    dispatchSpy = spyOn(storeMock, 'dispatch');
    TestBed.configureTestingModule({
      declarations: [TermsAndConditionsComponent, TestDummyHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: Store,
          useValue: storeMock
        },
        TermsConditionsService,
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestDummyHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsAndConditionsComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement;
    termsConditionsService = fixture.debugElement.injector.get(TermsConditionsService);
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be created by angular', () => {
    expect(fixture).not.toBeNull();
  });

  it('should display old legacy terms and conditions when feature is not enabled', () => {
    featureToggleServiceMock.getValue.and.returnValue(of(false));
    spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(false));
    component.ngOnInit();
    const legacy = fixture.debugElement.query(By.css('#content'));
    expect(legacy).toBeTruthy();
  });

  it('should dispatch LoadTermsConditions', () => {
    featureToggleServiceMock.getValue.and.returnValue(of(false));
    spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(true));
    pipeSpy.and.returnValue(of(null));
    component.ngOnInit();
    expect(pipeSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });

  it('should not dispatch when document is available', () => {
    featureToggleServiceMock.getValue.and.returnValue(of(false));
    spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(true));
    pipeSpy.and.returnValue(of(true));
    component.ngOnInit();
    expect(pipeSpy).toHaveBeenCalledTimes(1);
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should display terms and conditions related to register other organisation', () => {
    featureToggleServiceMock.getValue.and.returnValue(of(true));
    spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled');
    component.ngOnInit();
    expect(routerMock.navigate).toHaveBeenCalledWith(['terms-and-conditions-register-other-org']);
    expect(component.isTandCEnabled).toEqual(false);
    expect(termsConditionsService.isTermsConditionsFeatureEnabled).not.toHaveBeenCalled();
    expect(pipeSpy).not.toHaveBeenCalled();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
