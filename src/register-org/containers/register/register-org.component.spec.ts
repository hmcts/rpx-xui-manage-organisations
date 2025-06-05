import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registration-data.model';
import { RegisterOrgService } from '../../services';
import { RegisterComponent } from './register-org.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const mockRegisterOrgService = jasmine.createSpyObj('RegisterOrgService', [
    'getRegistrationData',
    'persistRegistrationData',
    'removeRegistrationData'
  ]);
  mockRegisterOrgService.REGISTER_ORG_NEW_ROUTE = 'register-org-new';

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const registrationData = {
    companyName: '',
    companyHouseNumber: null,
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
    regulatorRegisteredWith: null
  } as RegistrationData;

  beforeEach(async() => {
    mockRegisterOrgService.removeRegistrationData.and.callThrough();
    mockRegisterOrgService.persistRegistrationData.and.callThrough();
    mockRegisterOrgService.getRegistrationData.and.returnValue(registrationData);
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: RegisterOrgService, useValue: mockRegisterOrgService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockRegisterOrgService.getRegistrationData).toHaveBeenCalled();
    expect(component.registrationData).toEqual(registrationData);
  });

  it('should invoke persist registration data when component is unloaded', () => {
    component.ngOnDestroy();
    expect(mockRegisterOrgService.persistRegistrationData).toHaveBeenCalled();
  });

  it('should not invoke persist registration data when component is unloaded due to cancellation of registration journey', () => {
    mockRegisterOrgService.persistRegistrationData.calls.reset();
    spyOn(window, 'confirm').and.returnValue(true);
    component.cancelRegistrationJourney();
    component.ngOnDestroy();
    expect(mockRegisterOrgService.persistRegistrationData).not.toHaveBeenCalled();
  });

  it('should cancelRegistrationJourney confirmed by the user', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.cancelRegistrationJourney();
    expect(mockRegisterOrgService.removeRegistrationData).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'register']);
  });

  it('should cancelRegistrationJourney not confirmed by the user', () => {
    mockRouter.navigate.calls.reset();
    spyOn(window, 'confirm').and.returnValue(false);
    component.cancelRegistrationJourney();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
