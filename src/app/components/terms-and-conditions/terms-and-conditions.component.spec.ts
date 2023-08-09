import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TermsConditionsService } from '../../../shared/services/termsConditions.service';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';
import { FeatureToggleService } from '@hmcts/rpx-xui-common-lib';

const storeMock = {
  pipe: () => of(null),
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  dispatch: () => {}
};
let pipeSpy: jasmine.Spy;
let dispatchSpy: jasmine.Spy;

fdescribe('TermsAndConditionsComponent', () => {
  @Component({
    selector: 'app-exui-app-host-dummy-component',
    template: '<exui-terms-and-conditions></exui-terms-and-conditions>'
  })
  class TestDummyHostComponent {
    @ViewChild(TermsAndConditionsComponent, { static: true })
    public footerComponent: TermsAndConditionsComponent;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let testHostComponent: TestDummyHostComponent;
  let testHostFixture: ComponentFixture<TestDummyHostComponent>;
  let component: TermsAndConditionsComponent;
  let fixture: ComponentFixture<TermsAndConditionsComponent>;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let element: DebugElement;
  let termsConditionsService: TermsConditionsService;
  const featureToggleServiceMock = jasmine.createSpyObj('FeatureToggleService', ['getValue']);

  beforeEach(waitForAsync(() => {
    pipeSpy = spyOn(storeMock, 'pipe');
    dispatchSpy = spyOn(storeMock, 'dispatch');
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [TermsAndConditionsComponent, TestDummyHostComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Store,
          useValue: storeMock
        },
        TermsConditionsService,
        {
          provide: FeatureToggleService,
          useValue: featureToggleServiceMock
        }
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
    fixture.detectChanges();
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
});
