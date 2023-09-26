import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AddressMessageEnum } from '@hmcts/rpx-xui-common-lib';
import { INTERNATIONAL_HEADING, POSTCODE_HEADING } from '../../constants/register-org-constants';
import { RegisterOrgService } from '../../services';
import { RegisteredAddressComponent } from './registered-address.component';

describe('RegisteredAddressComponent', () => {
  let component: RegisteredAddressComponent;
  let fixture: ComponentFixture<RegisteredAddressComponent>;
  let mockRegisterOrgService: any;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };
  const mockRoute = {
    snapshot: {
      params: {
        internal: 'internal'
      }
    }
  };

  beforeEach(async () => {
    mockRegisterOrgService = jasmine.createSpyObj('mockRegisterOrgService', ['getRegistrationData', 'persistRegistrationData']);
    mockRegisterOrgService.getRegistrationData.and.returnValue({ address: null });
    await TestBed.configureTestingModule({
      declarations: [RegisteredAddressComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [{ provide: RegisterOrgService, useValue: mockRegisterOrgService },
        {
          provide: Router, useValue: mockRouter
        },
        { provide: ActivatedRoute, useValue: mockRoute }]
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

  it('should reset the component on pagerefresh', () => {
    component.onPageRefresh();
    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(component.headingText).toBe(POSTCODE_HEADING);
    expect(component.startedInternational).toBe(false);
    expect(component.addressChosen).toBe(false);
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
});
