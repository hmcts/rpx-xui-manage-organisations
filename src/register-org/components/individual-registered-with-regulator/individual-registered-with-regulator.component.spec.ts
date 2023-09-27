import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registration-data.model';
import { IndividualRegisteredWithRegulatorComponent } from './individual-registered-with-regulator.component';
import { RegisterOrgService } from '../../services/register-org.service';

describe('IndividualRegisteredWithRegulatorComponent', () => {
  let component: IndividualRegisteredWithRegulatorComponent;
  let fixture: ComponentFixture<IndividualRegisteredWithRegulatorComponent>;

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
    hasPBA: null,
    contactDetails: null,
    hasIndividualRegisteredWithRegulator: null,
    services: [],
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null,
    inInternationalMode: null
  };
  const mockSessionStorageService = jasmine.createSpyObj('SessionStorageService', [
    'getItem',
    'setItem',
    'removeItem'
  ]);

  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['get', 'post']);
  const service = new RegisterOrgService(mockSessionStorageService, mockHttpService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IndividualRegisteredWithRegulatorComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RegisterOrgService, useValue: service }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndividualRegisteredWithRegulatorComponent);
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
    component.registrationData.hasIndividualRegisteredWithRegulator = true;
    component.setFormControlValues();
    expect(component.registeredWithRegulatorFormGroup.get('registeredWithRegulator').value).toEqual('yes');
  });

  it('should set the no radio button form control', () => {
    component.registrationData = registrationData;
    component.registrationData.hasIndividualRegisteredWithRegulator = false;
    component.setFormControlValues();
    expect(component.registeredWithRegulatorFormGroup.get('registeredWithRegulator').value).toEqual('no');
  });

  it('should set the error message if none of the radio option is selected', () => {
    mockRouter.navigate.calls.reset();
    const errorMessage = {
      id: 'registered-with-regulator-yes',
      message: 'Please select an option'
    };
    component.registeredWithRegulatorFormGroup.get('registeredWithRegulator').setValue(null);
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(errorMessage);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should continue navigate to individual regulators details collection page', () => {
    component.registrationData = registrationData;
    component.registrationData.hasIndividualRegisteredWithRegulator = true;
    component.setFormControlValues();
    component.onContinue();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator-details']);
  });

  it('should continue navigate to check your answers page', () => {
    component.registrationData = registrationData;
    component.registrationData.hasIndividualRegisteredWithRegulator = false;
    component.setFormControlValues();
    component.onContinue();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });

  it('should back link navigate to the correct page', () => {
    spyOn(component, 'navigateToPreviousPage');
    component.onBack();
    expect(component.navigateToPreviousPage).toHaveBeenCalled();
  });
});
