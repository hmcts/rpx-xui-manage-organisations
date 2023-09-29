import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { CompanyHouseDetailsComponent } from './company-house-details.component';
import { RegisterOrgService } from '../../services/register-org.service';

describe('CompanyHouseDetailsComponent', () => {
  let component: CompanyHouseDetailsComponent;
  let fixture: ComponentFixture<CompanyHouseDetailsComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyHouseDetailsComponent],
      imports: [RouterTestingModule],
      providers: []
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHouseDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the error message if company name is null', () => {
    const companyNameError = { id: 'company-name', message: CompanyHouseDetailsMessage.NO_ORG_NAME };
    component.companyHouseFormGroup.get('companyName').setValue(null);
    component.onContinue();
    expect(component.companyNameError).toEqual(companyNameError);
  });

  it('should set the error message if company number is invalid', () => {
    const companyNumberError = { id: 'company-house-number', message: CompanyHouseDetailsMessage.INVALID_COMPANY_NUMBER };
    component.companyHouseFormGroup.get('companyHouseNumber').setValue('1234');
    component.onContinue();
    expect(component.companyNumberError).toEqual(companyNumberError);
  });

  it('should navigate the next page if values are correct', () => {
    component.companyHouseFormGroup.get('companyName').setValue('Company Name');
    component.companyHouseFormGroup.get('companyHouseNumber').setValue('12345678');
    component.onContinue();
    expect(component.registrationData.companyName).toEqual('Company Name');
    expect(component.registrationData.companyHouseNumber).toEqual('12345678');
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'registered-address', 'external']);
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

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
