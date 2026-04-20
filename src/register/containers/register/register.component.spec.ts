import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Store } from '@ngrx/store';
import { buildMockStoreProviders } from '../../../register-org/testing/mock-store-state';
import { of } from 'rxjs';
import { RegisterComponent } from './register.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ENVIRONMENT_CONFIG } from '../../../models/environmentConfig.model';
import { mockEnvironmentConfig } from '../../../shared/services/environment.service.spec';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockStore: any;
  let dispatchSpy: jasmine.Spy;
  let pipeSpy: jasmine.Spy;
  let router: Router;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        ...buildMockStoreProviders(),
        { provide: ENVIRONMENT_CONFIG, useValue: mockEnvironmentConfig },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();
    mockStore = TestBed.inject(Store);
    router = TestBed.inject(Router);
    dispatchSpy = spyOn(mockStore, 'dispatch');
    pipeSpy = spyOn(mockStore, 'pipe');
    pipeSpy.and.callThrough();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should instantiate page from template if init flag is true', () => {
    component.pageId = 'organisation-pba';
    component.init = { 'organisation-pba': true };
    component.instantiatePageItems();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should not instantiate page from template if init flag is false', () => {
    component.pageId = 'organisation-pba';
    component.init = { 'organisation-pba': false };
    component.instantiatePageItems();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('should instantiate page from template if init flag is undefined', () => {
    component.pageId = 'organisation-pba';
    component.init = { 'organisation-pba': undefined };
    component.instantiatePageItems();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should instantiate page from template if init flag is undefined', () => {
    component.pageId = 'organisation-name';
    component.instantiatePageItems();
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should navigate to confirmation page if form is submitted', () => {
    const navigateSpy = spyOn(router, 'navigateByUrl');
    component.isFromSubmitted$ = of(true);
    component.subscribeFormSubmission();
    component.isFromSubmitted$.toPromise().then(() => {
      expect(navigateSpy).toHaveBeenCalledWith('/register-org/confirmation');
    });
  });

  it('should navigate to next page if next url is available', () => {
    pipeSpy.and.returnValue(of('next'));
    component.subscribeNextUrl();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should instantiate page items', () => {
    const routeParams = { pageId: 'page1' };
    component.pageId = 'page2';
    pipeSpy.and.returnValue(of(routeParams));
    component.subscribeToRoute();
    fixture.detectChanges();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should set init status for page item', () => {
    component.pageId = 'organisation-address';
    const formData = {
      pageItems: {
        meta: {
          name: 'organisation-pba'
        },
        init: true
      },
      pageValues: {
        PBANumber1: 'PBA1111111'
      },
      nextUrl: 'organisation-have-dx'
    };
    pipeSpy.and.returnValue(of(formData));
    component.subscribeToPageItems();
    fixture.detectChanges();
    expect(component.init['organisation-pba']).toBeTruthy();
  });

  it('should show form validation when form is invalid', () => {
    const formDraft = { invalid: true };
    component.onPageContinue(formDraft);
    expect(component.isPageValid).toBeTruthy();
  });

  it('should not show form validation when form is valid', () => {
    const formDraft = { invalid: false };
    component.onPageContinue(formDraft);
    expect(component.isPageValid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should show validation error when PBA number is invalid', () => {
    const event = { eventId: 'addAnotherPBANumber', data: { invalid: true } };
    component.onClick(event);
    expect(component.isPageValid).toBeTruthy();
  });

  it('should add pba number when form is valid', () => {
    const event = { eventId: 'addAnotherPBANumber', data: { invalid: false } };
    component.onClick(event);
    expect(component.isPageValid).toBeFalsy();
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should remove pba number', () => {
    const event = { eventId: 'removePBANumber' };
    component.onClick(event);
    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should show form validation when form is invalid and onblur', () => {
    const event = { invalid: true };
    component.onBlur(event);
    expect(component.isPageValid).toBeTruthy();
  });

  it('should not show form validation when form is valid and onblur', () => {
    const event = { invalid: false };
    component.onBlur(event);
    expect(component.isPageValid).toBeFalsy();
  });

  afterEach(() => {
    fixture.destroy();
  });
});
