import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { ContactDetailsErrorMessage } from '../../models/contact-details.enum';
import { RegistrationData } from '../../models/registration-data.model';
import { ContactDetailsComponent } from './contact-details.component';
import { buildMockStoreProviders } from '../../testing/mock-store-state';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const registrationData: RegistrationData = {
    pbaNumbers: [],
    companyName: '',
    companyHouseNumber: null,
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    services: [],
    hasPBA: null,
    contactDetails: null,
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null,
    inInternationalMode: null,
    hasIndividualRegisteredWithRegulator: null,
    individualRegulators: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactDetailsComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        ExuiCommonLibModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...buildMockStoreProviders()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
    component.registrationData = registrationData;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the form control values', () => {
    component.registrationData.contactDetails = {
      firstName: 'John',
      lastName: 'Davis',
      workEmailAddress: 'john.davis@testorganisation.com'
    };
    component.setFormControlValues();
    expect(component.contactDetailsFormGroup.get('firstName').value).toEqual('John');
    expect(component.contactDetailsFormGroup.get('lastName').value).toEqual('Davis');
    expect(component.contactDetailsFormGroup.get('workEmailAddress').value).toEqual('john.davis@testorganisation.com');
  });

  it('should back link navigate to the check your answers page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/check-your-answers'
      }
    } as any);
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should back link navigate to the payment by account page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.registrationData.hasPBA = false;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account']);
  });

  it('should back link navigate to the payment by account details page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.registrationData.hasPBA = true;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account-details']);
  });

  it('should navigate to individual regulators page if validation is successful', () => {
    mockRouter.navigate.calls.reset();
    component.registrationData.contactDetails = {
      firstName: 'John',
      lastName: 'Davis',
      workEmailAddress: 'john.davis@testorganisation.com'
    };
    component.setFormControlValues();
    component.onContinue();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator']);
  });

  it('should fail validation if all the input fields are empty', () => {
    mockRouter.navigate.calls.reset();
    component.registrationData.contactDetails = {
      firstName: '',
      lastName: '',
      workEmailAddress: ''
    };
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(3);
    expect(component.firstNameError).toEqual(ContactDetailsErrorMessage.FIRST_NAME);
    expect(component.lastNameError).toEqual(ContactDetailsErrorMessage.LAST_NAME);
    expect(component.workEmailAddressError).toEqual(ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should fail validation if first name input field is empty', () => {
    mockRouter.navigate.calls.reset();
    component.registrationData.contactDetails = {
      firstName: '',
      lastName: 'Davis',
      workEmailAddress: 'john.davis@testorganisation.com'
    };
    component.setFormControlValues();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(1);
    expect(component.firstNameError).toEqual(ContactDetailsErrorMessage.FIRST_NAME);
    expect(component.lastNameError).toBeNull();
    expect(component.workEmailAddressError).toBeNull();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should fail validation if last name input field is empty', () => {
    mockRouter.navigate.calls.reset();
    component.registrationData.contactDetails = {
      firstName: 'John',
      lastName: '',
      workEmailAddress: 'john.davis@testorganisation.com'
    };
    component.setFormControlValues();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(1);
    expect(component.firstNameError).toBeNull();
    expect(component.lastNameError).toEqual(ContactDetailsErrorMessage.LAST_NAME);
    expect(component.workEmailAddressError).toBeNull();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should fail validation if work email address input field is empty', () => {
    mockRouter.navigate.calls.reset();
    component.registrationData.contactDetails = {
      firstName: 'John',
      lastName: 'Davis',
      workEmailAddress: ''
    };
    component.setFormControlValues();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(1);
    expect(component.firstNameError).toBeNull();
    expect(component.lastNameError).toBeNull();
    expect(component.workEmailAddressError).toEqual(ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should fail validation if work email address is invalid', () => {
    mockRouter.navigate.calls.reset();
    component.registrationData.contactDetails = {
      firstName: 'John',
      lastName: 'Davis',
      workEmailAddress: 'john.davis'
    };
    component.setFormControlValues();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(1);
    expect(component.firstNameError).toBeNull();
    expect(component.lastNameError).toBeNull();
    expect(component.workEmailAddressError).toEqual(ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
