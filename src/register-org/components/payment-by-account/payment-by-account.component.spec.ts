import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { RegistrationData } from '../../models/registrationdata.model';
import { PaymentByAccountComponent } from './payment-by-account.component';

describe('PaymentByAccountComponent', () => {
  let component: PaymentByAccountComponent;
  let fixture: ComponentFixture<PaymentByAccountComponent>;

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
    hasRegisteredWithRegulator: null,
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null
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

  it('should set the error message if none of the radio option is selection', () => {
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
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'contact-details']);
  });

  it('should back button navigate to organisation services access page', () => {
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-services-access']);
  });
});
