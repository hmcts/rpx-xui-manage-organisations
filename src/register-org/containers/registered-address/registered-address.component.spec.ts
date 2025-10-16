import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddressMessageEnum, AddressService, ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { INTERNATIONAL_HEADING, POSTCODE_HEADING } from '../../constants/register-org-constants';
import { RegisterOrgService } from '../../services';
import { RegisteredAddressComponent } from './registered-address.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegisteredAddressComponent', () => {
  let component: RegisteredAddressComponent;
  let fixture: ComponentFixture<RegisteredAddressComponent>;
  let mockRegisterOrgService: any;

  const mockRoute = {
    snapshot: {
      params: {
        internal: 'internal'
      }
    }
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  beforeEach(async () => {
    mockRegisterOrgService = jasmine.createSpyObj('mockRegisterOrgService', ['getRegistrationData', 'persistRegistrationData', 'REGISTER_ORG_NEW_ROUTE', 'CHECK_YOUR_ANSWERS_ROUTE']);
    mockRegisterOrgService.getRegistrationData.and.returnValue({ address: null });
    mockRegisterOrgService.REGISTER_ORG_NEW_ROUTE = 'register-org-new';
    mockRegisterOrgService.CHECK_YOUR_ANSWERS_ROUTE = 'check-your-answers';
    await TestBed.configureTestingModule({
      declarations: [RegisteredAddressComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule],
      providers: [{ provide: RegisterOrgService, useValue: mockRegisterOrgService },
        {
          provide: Router, useValue: mockRouter
        },
        { provide: ActivatedRoute, useValue: mockRoute },
        AddressService,
        provideHttpClient(withInterceptorsFromDi()), 
        provideHttpClientTesting()]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisteredAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start an international mode (radio buttons)', () => {
    component.startedInternational = false;
    component.headingText = POSTCODE_HEADING;

    component.onInternationalModeStart();
    fixture.detectChanges();

    expect(component.startedInternational).toBe(true);
    expect(component.addressChosen).toBe(false);
    expect(component.headingText).toBe(INTERNATIONAL_HEADING);
  });

  it('should get a persisted address', () => {
    const mockRegData = {
      address: {
        addressLine1: 'street',
        addressLine2: 'street2',
        addressLine3: 'extraStreet',
        postTown: 'city',
        country: 'unknown',
        postCode: 'L12 7RT'
      },
      inInternationalMode: false
    };
    mockRegisterOrgService.getRegistrationData.and.returnValue(mockRegData);
    component.ngOnInit();
    expect(component.formGroup.get('address').get('addressLine1').value).toBe('street');
    mockRegData.inInternationalMode = true;
    mockRegisterOrgService.getRegistrationData.and.returnValue(mockRegData);
    component.ngOnInit();
    expect(component.formGroup.get('address').get('addressLine1').value).toBe('street');
    expect(component.startedInternational).toBeTruthy();
    expect(component.isInternational).toBeTruthy();
    expect(component.registrationData.inInternationalMode).toBeTruthy();
  });

  it('should get a persisted postcode', () => {
    const mockRegData = {
      address: {
        addressLine1: 'street',
        addressLine2: 'street2',
        addressLine3: 'extraStreet',
        postTown: 'city',
        country: 'unknown',
        postCode: 'L12 7RT'
      },
      inInternationalMode: false
    };
    mockRegisterOrgService.getRegistrationData.and.returnValue(mockRegData);
    component.isInternal = false;
    component.ngOnInit();
    expect(component.formGroup.get('address').get('postCode').value).toBe('L12 7RT');
  });

  it('should check the form on continue', () => {
    component.startedInternational = true;
    component.isInternational = undefined;

    component.onContinue();

    component.addressErrors = [{
      id: 'govuk-radios',
      message: AddressMessageEnum.NO_OPTION_SELECTED
    }];
    component.submissionAttempted = true;

    const mockRegData = {
      address: {
        addressLine1: 'street',
        addressLine2: 'street2',
        addressLine3: 'extraStreet',
        postTown: 'city',
        country: 'unknown',
        postCode: 'L12 7RT'
      },
      inInternationalMode: false
    };
    mockRegisterOrgService.getRegistrationData.and.returnValue(mockRegData);
    component.startedInternational = true;
    component.isInternational = true;
    component.submissionAttempted = false;
    component.ngOnInit();
    component.onContinue();

    expect(component.registrationData.address).toBe(mockRegData.address);
    expect(component.registrationData.inInternationalMode).toBeTruthy();
    expect(component.submissionAttempted).toBeFalsy();
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should set international or non-international when option selected', () => {
    const mockRegData = {
      address: {
        addressLine1: 'street',
        addressLine2: 'street2',
        addressLine3: 'extraStreet',
        postTown: 'city',
        country: 'unknown',
        postCode: 'L12 7RT'
      },
      inInternationalMode: false
    };
    mockRegisterOrgService.getRegistrationData.and.returnValue(mockRegData);
    component.isInternal = true;
    component.ngOnInit();
    component.onOptionSelected(true);

    expect(component.isInternational).toBeTruthy();
    expect(component.submissionAttempted).toBeFalsy();
    expect(component.formGroup.get('address').get('country').value).toBe('');
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });

  it('should set postcode option details correctly', () => {
    component.onPostcodeOptionSelected();
    expect(component.submissionAttempted).toBe(false);
    expect(component.addressChosen).toBe(true);
    expect(component.addressErrors).toEqual([]);
  });

  it('should reset submission', () => {
    component.submissionAttempted = true;
    component.onResetSubmission();
    expect(component.submissionAttempted).toBe(false);
  });

  it('should back link navigate to the check your answers page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/check-your-answers'
      }
    } as any);
    component.onBack(true);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should back link navigate to the registered address page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack(true);
    expect(component.headingText).toEqual('What is the registered address of your organisation?');
    expect(component.startedInternational).toEqual(false);
    expect(component.addressChosen).toBe(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'registered-address', 'external']);
  });

  it('should back link navigate to the company house details page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'company-house-details']);
  });

  it('should back link navigate to the company house details page without a previousUrl', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: undefined
      }
    } as any);
    component.onBack(false);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'company-house-details']);
  });
});
