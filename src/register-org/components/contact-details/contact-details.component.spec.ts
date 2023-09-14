import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactDetailsErrorMessage } from 'src/register-org/models/contact-details.enum';
import { RegistrationData } from '../../models/registrationdata.model';
import { ContactDetailsComponent } from './contact-details.component';

describe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    services: [],
    hasPBA: null,
    contactDetails: null,
    companyHouseNumber: null,
    address: null,
    organisationType: null,
    organisationNumber: null,
    regulators: [],
    regulatorRegisteredWith: null,
    hasIndividualRegisteredWithRegulator: null,
    individualRegulators: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactDetailsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
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

  it('should back link navigate to the correct page', () => {
    component.registrationData.hasPBA = true;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account-details']);
    component.registrationData.hasPBA = false;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account']);
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
  });

  it('should fail validation if first name input field is empty', () => {
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
  });

  it('should fail validation if last name input field is empty', () => {
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
  });

  it('should fail validation if work email address input field is empty', () => {
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
  });

  it('should fail validation if work email address is invalid', () => {
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
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
