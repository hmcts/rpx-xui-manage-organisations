import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { throwError } from 'rxjs';
import { LoggerService } from '../../../shared/services/logger.service';
import { RegistrationData } from '../../models/registration-data.model';
import { RegisterOrgService } from '../../services';
import { CheckYourAnswersComponent } from './check-your-answers.component';

describe('CheckYourAnswersComponent', () => {
  let component: CheckYourAnswersComponent;
  let fixture: ComponentFixture<CheckYourAnswersComponent>;
  let router: Router;
  let registerOrgService: RegisterOrgService;
  const mockLoggerService = {
    info: jasmine.createSpy('info')
  };

  const registrationData: RegistrationData = {
    companyName: 'Minstry of Justice',
    companyHouseNumber: '11223344',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    hasPBA: true,
    pbaNumbers: [
      'PBA1234567',
      'PBA1234568'
    ],
    services: [
      { key: 'AAA7', value: 'Damages' },
      { key: 'ABA3', value: 'Divorce' }
    ],
    otherServices: 'test service',
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
    hasIndividualRegisteredWithRegulator: true,
    individualRegulators: []
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckYourAnswersComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: LoggerService, useValue: mockLoggerService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckYourAnswersComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    registerOrgService = TestBed.inject(RegisterOrgService);
    spyOn(router, 'navigate');
    spyOn(registerOrgService, 'getRegistrationData').and.returnValue(registrationData);
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should getOrganisationType return the correct organisation type from the ref data', () => {
    const organisationType = component.getOrganisationType('SolicitorOrganisation');
    expect(organisationType).toEqual('Solicitor Organisation');
  });

  it('should display error message banner for api error', () => {
    spyOn(registerOrgService, 'postRegistration').and.returnValue(throwError('error'));
    component.cyaFormGroup.get('confirmTermsAndConditions').setValue(true);
    component.onSubmitData();
    expect(component.validationErrors).toEqual([{ id: 'confirm-terms-and-conditions', message: 'Sorry, there is a problem with the service. Try again later' }]);
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

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
