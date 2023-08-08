import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { RegistrationData } from '../../models/registrationdata.model';
import { PaymentByAccountComponent } from './payment-by-account.component';

describe('PaymentByAccountComponent', () => {
  let component: PaymentByAccountComponent;
  let fixture: ComponentFixture<PaymentByAccountComponent>;

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
    regulatoryOrgType: null,
    reulatorRegisteredWith: null
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentByAccountComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [EnvironmentService]
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
    const errorMessage: ErrorMessage = {
      description: 'Please select at least one option',
      title: '',
      fieldId: 'pba-yes'
    };
    component.pbaFormGroup.get('pba').setValue(null);
    component.onContinue();
    expect(component.pbaError).toEqual(errorMessage);
    expect(scrollIntoViewSpy).toHaveBeenCalled();
  });
});
