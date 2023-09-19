import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { CompanyHouseDetailsComponent } from './company-house-details.component';

describe('CompanyHouseDetailsComponent', () => {
  let component: CompanyHouseDetailsComponent;
  let fixture: ComponentFixture<CompanyHouseDetailsComponent>;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyHouseDetailsComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: Router, useValue: mockRouter }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyHouseDetailsComponent);
    component = fixture.componentInstance;
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
    expect(component.registrationData.name).toEqual('Company Name');
    expect(component.registrationData.companyHouseNumber).toEqual('12345678');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'registered-address']);
  });

  it('should back link navigate to the correct page', () => {
    const getPreviousUrlSpy = spyOn(component, 'getPreviousUrl');
    getPreviousUrlSpy.and.returnValue('/check-your-answers');
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
    getPreviousUrlSpy.and.returnValue('/something-else');
    component.onBack();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-type']);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
