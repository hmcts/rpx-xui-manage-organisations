import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { RegistrationData } from '../../models/registration-data.model';
import { CheckYourAnswersComponent } from './check-your-answers.component';

describe('CheckYourAnswersComponent', () => {
  let component: CheckYourAnswersComponent;
  let fixture: ComponentFixture<CheckYourAnswersComponent>;
  let router: Router;

  const registrationData: RegistrationData = {
    companyName: 'Minstry of Justice',
    companyHouseNumber: '11223344',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    services: [],
    hasPBA: null,
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
    component.registrationData = registrationData;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should back link navigate to the check your answers page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/check-your-answers'
      }
    });
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should back link navigate to the organisation type page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    });
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-type']);
  });
});
