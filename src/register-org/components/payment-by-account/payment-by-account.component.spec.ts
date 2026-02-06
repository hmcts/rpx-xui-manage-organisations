import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { RegistrationData } from '../../models/registration-data.model';
import { PaymentByAccountComponent } from './payment-by-account.component';
import { buildMockStoreProviders } from '../../testing/mock-store-state';

describe('PaymentByAccountComponent', () => {
  let component: PaymentByAccountComponent;
  let fixture: ComponentFixture<PaymentByAccountComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const registrationData: RegistrationData = {
    pbaNumbers: [],
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
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule],
      providers: [
        EnvironmentService,
        { provide: Router, useValue: mockRouter },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...buildMockStoreProviders()
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
    component.registrationData.hasPBA = false;
    component.pbaFormGroup.get('pba').setValue('yes');
    component.onContinue();
    expect(component.registrationData.hasPBA).toEqual(true);
    expect(component.validationErrors.length).toEqual(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account-details']);
  });

  it('should continue button navigate to contact details page', () => {
    component.registrationData = registrationData;
    component.registrationData.hasPBA = true;
    component.registrationData.pbaNumbers = ['PBA1234567', 'PBA1234568'];
    component.pbaFormGroup.get('pba').setValue('no');
    component.onContinue();
    expect(component.registrationData.hasPBA).toEqual(false);
    expect(component.registrationData.pbaNumbers.length).toEqual(0);
    expect(component.validationErrors.length).toEqual(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'contact-details']);
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

  it('should back link navigate to the organisation services access page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-services-access']);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
