import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registration-data.model';
import { RegisterOrgService } from '../../services';
import { CheckYourAnswersComponent } from './check-your-answers.component';

describe('CheckYourAnswersComponent', () => {
  let component: CheckYourAnswersComponent;
  let fixture: ComponentFixture<CheckYourAnswersComponent>;
  let router: Router;
  let registerOrgService: RegisterOrgService;

  const registrationData: RegistrationData = {
    companyName: 'Minstry of Justice',
    companyHouseNumber: '11223344',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    services: [],
    hasPBA: true,
    pbaNumbers: [
      'PBA1234567',
      'PBA1234568'
    ],
    contactDetails: {
      firstName: 'John',
      lastName: 'Davis',
      workEmailAddress: 'john.davis@testorganisation.com'
    },
    address: null,
    organisationType: null,
    inInternationalMode: true,
    regulators: [],
    regulatorRegisteredWith: null,
    hasIndividualRegisteredWithRegulator: null,
    individualRegulators: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckYourAnswersComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckYourAnswersComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    registerOrgService = TestBed.inject(RegisterOrgService);
    spyOn(registerOrgService, 'getRegistrationData').and.returnValue(registrationData);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should back link navigate to the individual registered with the regulator details page', () => {
    component.registrationData.hasIndividualRegisteredWithRegulator = true;
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator-details', true]);
  });

  it('should back link navigate to the individual registered with the regulator page', () => {
    component.registrationData.hasIndividualRegisteredWithRegulator = false;
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator']);
  });

  it('should set the payment by account url to be the yes or no page', () => {
    component.registrationData.hasPBA = false;
    component.ngOnInit();
    expect(component.pbaUrl).toEqual('/register-org-new/payment-by-account');
  });

  it('should set the payment by account url to be the details page', () => {
    component.registrationData.hasPBA = true;
    component.ngOnInit();
    expect(component.pbaUrl).toEqual('/register-org-new/payment-by-account-details');
  });
});
