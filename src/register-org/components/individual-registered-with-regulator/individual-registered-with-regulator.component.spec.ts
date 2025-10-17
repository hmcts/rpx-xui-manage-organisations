import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RegisterOrgModule } from '../../register-org.module';
import { buildMockStoreProviders } from '../../testing/mock-store-state';
import { RegistrationData } from '../../models/registration-data.model';
import { RegisterOrgService } from '../../services/register-org.service';
import { IndividualRegisteredWithRegulatorComponent } from './individual-registered-with-regulator.component';

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
    individualRegulators: [],
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
      // RegisterOrgModule already declares IndividualRegisteredWithRegulatorComponent and related dependencies
      declarations: [],
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule, RegisterOrgModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RegisterOrgService, useValue: service },
        ...buildMockStoreProviders()
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
    expect(component.registrationData.individualRegulators.length).toEqual(0);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
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

  it('should back link navigate to the contact details page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'contact-details']);
  });
});
