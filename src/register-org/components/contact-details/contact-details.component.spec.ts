import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registrationdata.model';
import { ContactDetailsComponent } from './contact-details.component';
import { Router } from '@angular/router';
import { ContactDetailsErrorMessage } from 'src/register-org/models/contact-details.enum';

fdescribe('ContactDetailsComponent', () => {
  let component: ContactDetailsComponent;
  let fixture: ComponentFixture<ContactDetailsComponent>;
  let nativeElement: any;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: true,
    dxNumber: '931NR',
    dxExchange: 'MIDDLESEX',
    hasPBA: null,
    contactDetails: {
      firstName: 'John',
      lastName: 'Davis',
      workEmailAddress: 'john.davis@testorganisation.com'
    },
    hasIndividualRegisteredWithRegulator: null,
    services: [],
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null
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
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDetailsComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the form control values', () => {
    component.registrationData = registrationData;
    component.setFormControlValues();
    expect(component.contactDetailsFormGroup.get('firstName').value).toEqual('John');
    expect(component.contactDetailsFormGroup.get('lastName').value).toEqual('Davis');
    expect(component.contactDetailsFormGroup.get('workEmailAddress').value).toEqual('john.davis@testorganisation.com');
  });

  it('should back link navigate to the correct page', () => {
    component.registrationData = registrationData;
    component.registrationData.hasPBA = true;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account-details']);
    component.registrationData.hasPBA = false;
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account']);
  });

  it('should fail validation if all the input fields are empty', () => {
    // nativeElement.querySelector('#first-name').value = null;
    // nativeElement.querySelector('#last-name').value = null;
    // nativeElement.querySelector('#work-email-address').value = null;
    nativeElement.querySelector('.govuk-button--primary').click();
    fixture.detectChanges();
    expect(component.validationErrors.length).toEqual(3);
    expect(component.firstNameError).toEqual(ContactDetailsErrorMessage.FIRST_NAME);
    expect(component.lastNameError).toEqual(ContactDetailsErrorMessage.LAST_NAME);
    expect(component.workEmailAddressError).toEqual(ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS);
  });

  it('should fail validation if first name input field is empty', () => {
    // nativeElement.querySelector('#first-name').value = null;
    nativeElement.querySelector('#last-name').value = 'Smith';
    nativeElement.querySelector('#work-email-address').value = 'will.smith@test.com';
    nativeElement.querySelector('.govuk-button--primary').click();
    fixture.detectChanges();
    expect(component.validationErrors.length).toEqual(1);
    expect(component.firstNameError).toEqual(ContactDetailsErrorMessage.FIRST_NAME);
    expect(component.lastNameError).toBeNull();
    expect(component.workEmailAddressError).toBeNull();
  });

  it('should fail validation if last name input field is empty', () => {
    nativeElement.querySelector('#first-name').value = 'Will';
    // nativeElement.querySelector('#last-name').value = null;
    nativeElement.querySelector('#work-email-address').value = 'will.smith@test.com';
    nativeElement.querySelector('.govuk-button--primary').click();
    fixture.detectChanges();
    expect(component.validationErrors.length).toEqual(1);
    expect(component.lastNameError).toEqual(ContactDetailsErrorMessage.LAST_NAME);
    expect(component.firstNameError).toBeNull();
    expect(component.workEmailAddressError).toBeNull();
  });

  it('should fail validation if work email address input field is empty', () => {
    nativeElement.querySelector('#first-name').value = 'Will';
    nativeElement.querySelector('#last-name').value = 'Smith';
    // nativeElement.querySelector('#work-email-address').value = null;
    console.log('FIRST NAME BEFORE', nativeElement.querySelector('#first-name').value);
    console.log('LAST NAME BEFORE', nativeElement.querySelector('#last-name').value);
    console.log('WORK EMAIL ADDRESS BEFORE', nativeElement.querySelector('#work-email-address').value);
    nativeElement.querySelector('.govuk-button--primary').click();
    fixture.detectChanges();
    console.log('FIRST NAME AFTER', nativeElement.querySelector('#first-name').value);
    console.log('LAST NAME AFTER', nativeElement.querySelector('#last-name').value);
    console.log('WORK EMAIL ADDRESS AFTER', nativeElement.querySelector('#work-email-address').value);
    expect(component.validationErrors.length).toEqual(1);
    expect(component.lastNameError).toBeNull();
    expect(component.firstNameError).toBeNull();
    expect(component.workEmailAddressError).toEqual(ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS);
  });

  fit('should fail validation if work email address is invalid', () => {
    // nativeElement.querySelector('#first-name').value = 'Will';
    // nativeElement.querySelector('#last-name').value = 'Smith';
    // nativeElement.querySelector('#work-email-address').value = 'will.smith';
    console.log('VALIDATION ERRORS BEFORE', JSON.stringify(component.validationErrors));
    component.validationErrors = [];
    console.log('VALIDATION ERRORS AFTER', JSON.stringify(component.validationErrors));
    console.log('FIRST NAME BEFORE', nativeElement.querySelector('#first-name').value);
    console.log('LAST NAME BEFORE', nativeElement.querySelector('#last-name').value);
    console.log('WORK EMAIL ADDRESS BEFORE', nativeElement.querySelector('#work-email-address').value);
    const firstNameInputElement = nativeElement.querySelector('#first-name');
    firstNameInputElement.value = 'Will';
    firstNameInputElement.dispatchEvent(new Event('input'));
    const lastNameInputElement = nativeElement.querySelector('#last-name');
    lastNameInputElement.value = 'Smith';
    lastNameInputElement.dispatchEvent(new Event('input'));
    const workEmailAddressInputElement = nativeElement.querySelector('#work-email-address');
    workEmailAddressInputElement.value = 'willl.smith';
    workEmailAddressInputElement.dispatchEvent(new Event('input'));
    nativeElement.querySelector('.govuk-button--primary').click();
    fixture.detectChanges();
    console.log('FIRST NAME AFTER', nativeElement.querySelector('#first-name').value);
    console.log('LAST NAME AFTER', nativeElement.querySelector('#last-name').value);
    console.log('WORK EMAIL ADDRESS AFTER', nativeElement.querySelector('#work-email-address').value);
    console.log('VALIDATION ERROR 0', JSON.stringify(component.validationErrors[0]));
    console.log('VALIDATION ERROR 1', JSON.stringify(component.validationErrors[1]));
    console.log('VALIDATION ERROR 2', JSON.stringify(component.validationErrors[2]));
    expect(component.validationErrors.length).toEqual(1);
    expect(component.lastNameError).toBeNull();
    expect(component.firstNameError).toBeNull();
    expect(component.workEmailAddressError).toEqual(ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS);
  });

  it('should navigate to individual regulators page if validation is successful', () => {
    component.registrationData = registrationData;
    component.setFormControlValues();
    component.onContinue();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator']);
  });
});

function setInputValue(fixture: ComponentFixture<ContactDetailsComponent>, selector: string, value: string) {
  const inputElement = fixture.debugElement.nativeElement.querySelector(selector);
  inputElement.value = value;
  inputElement.dispatchEvent(new Event('input'));
  fixture.detectChanges();
}
