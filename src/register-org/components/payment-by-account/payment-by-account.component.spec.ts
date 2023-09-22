import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { RegistrationData } from '../../models/registration-data.model';
import { PaymentByAccountComponent } from './payment-by-account.component';

describe('PaymentByAccountComponent', () => {
  let component: PaymentByAccountComponent;
  let fixture: ComponentFixture<PaymentByAccountComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const registrationData: RegistrationData = {
    companyName: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    services: [],
    hasPBA: null,
    contactDetails: null,
    hasIndividualRegisteredWithRegulator: null,
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null,
    inInternationalMode: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentByAccountComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        EnvironmentService,
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentByAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the yes radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasPBA = true;
    component.setFormControlValues();
    expect(component.pbaFormGroup.get('pba').value).toEqual('yes');
  });

  it('should set the no radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasPBA = false;
    component.setFormControlValues();
    expect(component.pbaFormGroup.get('pba').value).toEqual('no');
  });

  it('should set the error message and do not navigate if none of the radio option is selected', () => {
    mockRouter.navigate.calls.reset();
    const scrollIntoViewSpy = jasmine.createSpy();
    component.errorSummaryTitleElement = {
      nativeElement: {
        scrollIntoView: scrollIntoViewSpy
      }
    };
    const errorMessage = {
      id: 'pba-yes',
      message: 'Please select an option'
    };
    component.pbaFormGroup.get('pba').setValue(null);
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(errorMessage);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should continue button navigate to payment by account details page', () => {
    component.pbaFormGroup.get('pba').setValue('yes');
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account-details']);
  });

  it('should continue button navigate to contact details page', () => {
    component.pbaFormGroup.get('pba').setValue('no');
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-services-access']);
  });

  it('should back link navigate to the correct page', () => {
    spyOn(component, 'navigateToPreviousPage');
    component.onBack();
    expect(component.navigateToPreviousPage).toHaveBeenCalled();
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
