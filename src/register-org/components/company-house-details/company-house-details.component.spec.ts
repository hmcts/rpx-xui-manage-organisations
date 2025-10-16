import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { RegisterOrgService } from '../../services/register-org.service';
import { CompanyHouseDetailsComponent } from './company-house-details.component';

describe('CompanyHouseDetailsComponent', () => {
  let component: CompanyHouseDetailsComponent;
  let fixture: ComponentFixture<CompanyHouseDetailsComponent>;
  let router: any;

  const mockSessionStorageService = jasmine.createSpyObj('SessionStorageService', [
    'getItem',
    'setItem',
    'removeItem'
  ]);

  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['get', 'post']);
  const service = new RegisterOrgService(mockSessionStorageService, mockHttpService);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CompanyHouseDetailsComponent],
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule],
      providers: [
        { provide: RegisterOrgService, useValue: service }
      ]
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
    expect(component.validationErrors.length).toEqual(1);
    expect(component.companyNameError).toEqual(companyNameError);
    expect(component.validationErrors.length).toEqual(1);
  });

  it('should set the error message if company number is invalid', () => {
    const companyNumberError = { id: 'company-house-number', message: CompanyHouseDetailsMessage.INVALID_COMPANY_NUMBER };
    component.companyHouseFormGroup.get('companyName').setValue('Company Name');
    component.companyHouseFormGroup.get('companyHouseNumber').setValue('1234');
    component.onContinue();
    expect(component.validationErrors.length).toEqual(1);
    expect(component.companyNumberError).toEqual(companyNumberError);
    expect(component.validationErrors.length).toEqual(1);
  });

  it('should set the error message if company name is null and company number is invalid', () => {
    const companyNameError = { id: 'company-name', message: CompanyHouseDetailsMessage.NO_ORG_NAME };
    const companyNumberError = { id: 'company-house-number', message: CompanyHouseDetailsMessage.INVALID_COMPANY_NUMBER };
    component.companyHouseFormGroup.get('companyName').setValue(null);
    component.companyHouseFormGroup.get('companyHouseNumber').setValue('1234');
    component.onContinue();
    expect(component.companyNameError).toEqual(companyNameError);
    expect(component.companyNumberError).toEqual(companyNumberError);
    expect(component.validationErrors.length).toEqual(2);
  });

  it('should navigate the next page if values are correct', () => {
    component.companyHouseFormGroup.get('companyName').setValue('Company Name');
    component.companyHouseFormGroup.get('companyHouseNumber').setValue('12345678');
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
    expect(component.companyNameError).toBeNull();
    expect(component.companyNumberError).toBeNull();
    expect(component.registrationData.companyName).toEqual('Company Name');
    expect(component.registrationData.companyHouseNumber).toEqual('12345678');
    expect(component.companyNameError).toBeNull();
    expect(component.companyNumberError).toBeNull();
    expect(component.validationErrors.length).toEqual(0);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'registered-address', 'external']);
  });

  it('should back link navigate to the check your answers page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/check-your-answers'
      }
    } as any);
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  it('should back link navigate to the organisation type page', () => {
    spyOnProperty(component, 'currentNavigation', 'get').and.returnValue({
      previousNavigation: {
        finalUrl: '/something-else'
      }
    } as any);
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-type']);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
