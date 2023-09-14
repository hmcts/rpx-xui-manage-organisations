import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OrganisationServicesMessage } from '../../../register-org/models';
import { EnvironmentService } from '../../../shared/services/environment.service';
import { OrganisationServicesAccessComponent } from './organisation-services-access.component';

describe('OrganisationServicesAccessComponent', () => {
  let component: OrganisationServicesAccessComponent;
  let fixture: ComponentFixture<OrganisationServicesAccessComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisationServicesAccessComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [EnvironmentService]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationServicesAccessComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set the error message and navigate to next the page', () => {
    spyOn(router, 'navigate');
    component.registrationData.services = ['Civil'];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'payment-by-account']);
  });

  it('should set the error message and stay on the page', () => {
    spyOn(router, 'navigate');
    component.registrationData.services = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const error = { message: OrganisationServicesMessage.NO_ORG_SERVICES, id: 'Civil' };
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(error);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
