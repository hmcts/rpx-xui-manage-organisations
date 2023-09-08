import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import {
  RegistrationData,
  RegulatorType,
  RegulatoryOrganisationTypeMessage,
  RegulatoryType
} from '../../../register-org/models';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegulatorDetailsComponent } from './regulator-details.component';

describe('RegulatorDetailsComponent', () => {
  let component: RegulatorDetailsComponent;
  let fixture: ComponentFixture<RegulatorDetailsComponent>;
  let mockLovRefDataService: any;
  let nativeElement: any;
  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    services: [],
    hasPBA: null,
    contactDetails: null,
    companyHouseNumber: null,
    address: null,
    organisationType: null,
    organisationNumber: null,
    regulators: [],
    regulatorRegisteredWith: null,
    hasIndividualRegisteredWithRegulator: null,
    individualRegulators: []
  };

  const organisationTypes = [
    { name: 'Solicitor Regulation Authority', id: 'SRA' },
    { name: 'Financial Conduct Authority', id: 'FCA' },
    { name: 'Other', id: 'Other' },
    { name: 'Not Applicable', id: 'NA' }
  ];

  beforeEach(async () => {
    mockLovRefDataService = jasmine.createSpyObj('LovRefDataService', ['getRegulatoryOrganisationTypes']);
    mockLovRefDataService.getRegulatoryOrganisationTypes.and.returnValue(of(organisationTypes));
    await TestBed.configureTestingModule({
      declarations: [RegulatorDetailsComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: Router, useValue: mockRouter
        },
        {
          provide: LovRefDataService, useValue: mockLovRefDataService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulatorDetailsComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.registrationData = registrationData;
    spyOn(component, 'onOptionSelected').and.callThrough();
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display a dropdown with "none" as default value during initial load', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement: HTMLSelectElement = nativeElement.querySelector('#regulator-type0');
    expect(selectElement.value).toContain(component.SELECT_A_VALUE);
  });

  it('should show "Add another regulator" button and "Registration number" field if a regulator type is selected', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
    const selectElement: HTMLSelectElement = nativeElement.querySelector('#regulator-type0');
    selectElement.selectedIndex = 1;
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.regulators.controls[0].get('regulatorType').value).toEqual('SRA');
    expect(component.onOptionSelected).toHaveBeenCalledWith('SRA', 0);
    expect(component.regulators.controls[0].get('regulatorName')).toBeFalsy();
    expect(component.regulators.controls[0].get('organisationRegistrationNumber')).toBeTruthy();
    expect(nativeElement.querySelector('#regulator-name0')).toBeFalsy();
    expect(nativeElement.querySelector('#organisation-registration-number0')).toBeTruthy();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeTruthy();
  });

  it('should show "Add another regulator" button, and "Regulator name" and "Registration number" fields if the regulator type "Other" is selected', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
    const selectElement: HTMLSelectElement = nativeElement.querySelector('#regulator-type0');
    selectElement.selectedIndex = 3;
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.regulators.controls[0].get('regulatorType').value).toEqual('Other');
    expect(component.onOptionSelected).toHaveBeenCalledWith('Other', 0);
    expect(component.regulators.controls[0].get('regulatorName')).toBeTruthy();
    expect(component.regulators.controls[0].get('organisationRegistrationNumber')).toBeTruthy();
    expect(nativeElement.querySelector('#regulator-name0')).toBeTruthy();
    expect(nativeElement.querySelector('#organisation-registration-number0')).toBeTruthy();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeTruthy();
  });

  it('should show only the "Add another regulator" button if the regulator type "NA" is selected', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
    const selectElement: HTMLSelectElement = nativeElement.querySelector('#regulator-type0');
    selectElement.selectedIndex = 4;
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.regulators.controls[0].get('regulatorType').value).toEqual('NA');
  });

  it('should add a new regulator entry when the "Add another regulator" button is clicked', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    spyOn(component, 'onAddNewBtnClicked').and.callThrough();
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    selectElement0.value = selectElement0.options[1].value;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const addButton = nativeElement.querySelector('#add-another-regulator');
    addButton.click();
    expect(component.onAddNewBtnClicked).toHaveBeenCalled();
    fixture.detectChanges();
    const selectElement1 = nativeElement.querySelector('#regulator-type1');
    expect(selectElement1).toBeTruthy();
    // The "Add another regulator" button should not be displayed until a regulator type has been selected for the
    // new entry
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
    selectElement1.value = selectElement1.options[1].value;
    selectElement1.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeTruthy();
  });

  it('should not show a "Remove" button when there is only one regulator entry', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    selectElement0.value = selectElement0.options[1].value;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(nativeElement.querySelector('#remove-button0')).toBeFalsy();
  });

  it('should show a "Remove" button for every entry when there is more than one regulator entry', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    selectElement0.value = selectElement0.options[1].value;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(nativeElement.querySelector('#remove-button0')).toBeFalsy();
    const addButton = nativeElement.querySelector('#add-another-regulator');
    addButton.click();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#remove-button0')).toBeTruthy();
    expect(nativeElement.querySelector('#remove-button1')).toBeTruthy();
  });

  it('should remove the regulator entry when "Remove" button is clicked', () => {
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    selectElement0.selectedIndex = 2;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    nativeElement.querySelector('#add-another-regulator').click();
    fixture.detectChanges();
    const selectElement1 = nativeElement.querySelector('#regulator-type1');
    selectElement1.selectedIndex = 3;
    selectElement1.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    nativeElement.querySelector('#add-another-regulator').click();
    fixture.detectChanges();
    const selectElement2 = nativeElement.querySelector('#regulator-type2');
    selectElement2.selectedIndex = 4;
    selectElement2.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(nativeElement.querySelector('#remove-button0')).toBeTruthy();
    expect(nativeElement.querySelector('#remove-button1')).toBeTruthy();
    expect(nativeElement.querySelector('#remove-button2')).toBeTruthy();
    nativeElement.querySelector('#remove-button1').click();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#remove-button2')).toBeFalsy();
    nativeElement.querySelector('#remove-button1').click();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#remove-button0')).toBeFalsy();
    expect(nativeElement.querySelector('#remove-button1')).toBeFalsy();
  });

  it('should select unique "Not Applicable" regulatory type submitting the form', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement0: HTMLSelectElement = nativeElement.querySelector('#regulator-type0');
    selectElement0.selectedIndex = 4;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const addButton = nativeElement.querySelector('#add-another-regulator');
    addButton.click();
    fixture.detectChanges();
    const selectElement1: HTMLSelectElement = nativeElement.querySelector('#regulator-type1');
    selectElement1.selectedIndex = 4;
    selectElement1.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    component.onContinueClicked();
    expect(component.registrationData.regulators.length).toEqual(1);
    expect(component.registrationData.regulators[0].regulatorType).toEqual(RegulatoryType.NotApplicable);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-services-access']);
  });

  it('should validate the form on clicking "Continue" and not persist data or navigate to next page if validation fails', () => {
    spyOn(component, 'onContinueClicked').and.callThrough();
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    // Select the "Other" option and leave the mandatory regulatorName field blank deliberately
    selectElement0.value = selectElement0.options[3].value;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const addButton = nativeElement.querySelector('#add-another-regulator');
    addButton.click();
    fixture.detectChanges();
    // Deliberately omit selecting a regulator type for the second entry and click "Continue"
    const continueButton = nativeElement.querySelector('.govuk-button--primary');
    continueButton.click();
    fixture.detectChanges();
    expect(component.onContinueClicked).toHaveBeenCalled();
    expect(component.validationErrors.length).toBe(2);
    expect(component.validationErrors[0]).toEqual({
      description: RegulatoryOrganisationTypeMessage.NO_REGULATOR_NAME,
      title: '',
      fieldId: 'regulator-name0'
    });
    expect(component.validationErrors[1]).toEqual({
      description: RegulatoryOrganisationTypeMessage.NO_REGISTRATION_NUMBER,
      title: '',
      fieldId: 'organisation-registration-number0'
    });
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should validate the form on clicking "Continue" and persist data and navigate to next page if validation succeeds', () => {
    spyOn(component, 'onContinueClicked').and.callThrough();
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    // Select the "Other" option and fill in the mandatory regulatorName field
    selectElement0.value = selectElement0.options[3].value;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const regulatorNameElement = nativeElement.querySelector('#regulator-name0');
    regulatorNameElement.value = 'Test';
    regulatorNameElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const registrationNumberElement = nativeElement.querySelector('#organisation-registration-number0');
    registrationNumberElement.value = '123';
    registrationNumberElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const addButton = nativeElement.querySelector('#add-another-regulator');
    addButton.click();
    fixture.detectChanges();
    const selectElement1 = nativeElement.querySelector('#regulator-type1');
    selectElement1.value = selectElement1.options[1].value;
    selectElement1.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const registrationNumberElement1 = nativeElement.querySelector('#organisation-registration-number1');
    registrationNumberElement1.value = '1234';
    registrationNumberElement1.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const continueButton = nativeElement.querySelector('.govuk-button--primary');
    continueButton.click();
    fixture.detectChanges();
    expect(component.onContinueClicked).toHaveBeenCalled();
    expect(component.validationErrors.length).toBe(0);
    expect(mockRouter.navigate).toHaveBeenCalled();
  });

  it('should set the error message if regulator name is empty for a known regulator type', () => {
    component.registrationData.regulators = [{
      regulatorType: 'SRA',
      organisationRegistrationNumber: ''
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    const registrationNumberError = { title: '', description: RegulatoryOrganisationTypeMessage.NO_REGISTRATION_NUMBER, fieldId: 'organisation-registration-number0' };
    component.onContinueClicked();
    expect(component.validationErrors[0]).toEqual(registrationNumberError);
  });

  it('should set the error message if regulator name & number is empty for Other regulator type', () => {
    component.registrationData.regulators = [{
      regulatorType: 'Other',
      regulatorName: '',
      organisationRegistrationNumber: ''
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    const reglatorNameError = { title: '', description: RegulatoryOrganisationTypeMessage.NO_REGULATOR_NAME, fieldId: 'regulator-name0' };
    const registrationNumberError = { title: '', description: RegulatoryOrganisationTypeMessage.NO_REGISTRATION_NUMBER, fieldId: 'organisation-registration-number0' };
    component.onContinueClicked();
    expect(component.validationErrors[0]).toEqual(reglatorNameError);
    expect(component.validationErrors[1]).toEqual(registrationNumberError);
  });

  it('should not set the error message if regulator type is NA', () => {
    component.registrationData.regulators = [{
      regulatorType: 'NA'
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinueClicked();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set the error message if entries for regulator details are correct for SRA', () => {
    component.registrationData.regulators = [{
      regulatorType: 'SRA',
      organisationRegistrationNumber: '123'
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinueClicked();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set the error message if entries for regulator are correct for Other', () => {
    component.registrationData.regulators = [{
      regulatorType: 'Other',
      regulatorName: 'Test',
      organisationRegistrationNumber: '123'
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinueClicked();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set the error message if duplicate entries for regulator - SRA', () => {
    component.registrationData.regulators = [
      {
        regulatorType: 'SRA',
        organisationRegistrationNumber: '123'
      },
      {
        regulatorType: 'SRA',
        organisationRegistrationNumber: '1234'
      }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinueClicked();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should set the duplicate error message if duplicate entries for regulator - SRA', () => {
    component.registrationData.regulators = [
      {
        regulatorType: 'SRA',
        organisationRegistrationNumber: '123'
      },
      {
        regulatorType: 'SRA',
        organisationRegistrationNumber: '123'
      }];
    component.setFormControlValues();
    fixture.detectChanges();
    const duplicateError = { title: '', description: RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR, fieldId: 'regulator-type0' };
    component.onContinueClicked();
    expect(component.validationErrors[0]).toEqual(duplicateError);
  });

  it('should set the duplicate error message if duplicate entries for regulator - Other', () => {
    component.registrationData.regulators = [
      {
        regulatorType: 'Other',
        regulatorName: 'Test',
        organisationRegistrationNumber: '123'
      },
      {
        regulatorType: 'Other',
        regulatorName: 'Test',
        organisationRegistrationNumber: '123'
      }];
    component.setFormControlValues();
    fixture.detectChanges();
    const duplicateError = { title: '', description: RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR, fieldId: 'regulator-type0' };
    component.onContinueClicked();
    expect(component.validationErrors[0]).toEqual(duplicateError);
  });

  it('should not set error message if duplicate entries for regulator - Other', () => {
    component.registrationData.regulators = [
      {
        regulatorType: 'Other',
        regulatorName: 'Test1',
        organisationRegistrationNumber: '123'
      },
      {
        regulatorType: 'Other',
        regulatorName: 'Test2',
        organisationRegistrationNumber: '123'
      }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinueClicked();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set error message if duplicate entries for regulator - Other', () => {
    component.registrationData.regulators = [
      {
        regulatorType: 'Other',
        regulatorName: 'Test',
        organisationRegistrationNumber: '123'
      },
      {
        regulatorType: 'Other',
        regulatorName: 'Test',
        organisationRegistrationNumber: '1234'
      }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinueClicked();
    expect(component.validationErrors.length).toEqual(0);
  });
});
