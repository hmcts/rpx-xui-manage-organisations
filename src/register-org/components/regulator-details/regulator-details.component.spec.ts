import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
import { buildMockStoreProviders } from '../../testing/mock-store-state';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('RegulatorDetailsComponent', () => {
  let component: RegulatorDetailsComponent;
  let fixture: ComponentFixture<RegulatorDetailsComponent>;
  let mockLovRefDataService: any;
  let router: Router;
  let nativeElement: any;

  const mockRoute = {
    snapshot: {
      params: {
        backLinkTriggeredFromCYA: true
      }
    }
  };

  const registrationData: RegistrationData = {
    pbaNumbers: [],
    companyName: '',
    companyHouseNumber: null,
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    services: [],
    hasPBA: null,
    contactDetails: null,
    address: null,
    organisationType: null,
    regulators: [],
    regulatorRegisteredWith: null,
    hasIndividualRegisteredWithRegulator: null,
    individualRegulators: [],
    inInternationalMode: null
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
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute, useValue: mockRoute
        },
        {
          provide: LovRefDataService, useValue: mockLovRefDataService
        },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
        ...buildMockStoreProviders()
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
    expect(component.regulators.controls[0].get('regulatorType').value).toEqual('Solicitor Regulation Authority');
    expect(component.onOptionSelected).toHaveBeenCalledWith('Solicitor Regulation Authority', 0);
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
    expect(component.regulators.controls[0].get('regulatorType').value).toEqual('Not Applicable');
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
    component.onContinue();
    expect(component.registrationData.regulators.length).toEqual(1);
    expect(component.registrationData.regulators[0].regulatorType).toEqual(RegulatoryType.NotApplicable);
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'organisation-services-access']);
  });

  it('should changing the regulator type clear the organisation registration number field', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.regulators = [];
    component.setFormControlValues();
    fixture.detectChanges();
    const selectElement0: HTMLSelectElement = nativeElement.querySelector('#regulator-type0');
    selectElement0.selectedIndex = 0;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const registrationNumberElement = nativeElement.querySelector('#organisation-registration-number0');
    registrationNumberElement.value = '123';
    registrationNumberElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    selectElement0.selectedIndex = 0;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(registrationNumberElement.value).toEqual('');
  });

  it('should validate the form on clicking "Continue" and not persist data or navigate to next page if validation fails', () => {
    spyOn(component, 'onContinue').and.callThrough();
    component.validationErrors = [];
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
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.validationErrors.length).toBe(3);
    expect(component.validationErrors[0]).toEqual({
      id: 'regulator-name0',
      message: RegulatoryOrganisationTypeMessage.NO_REGULATOR_NAME
    });
    expect(component.validationErrors[1]).toEqual({
      id: 'organisation-registration-number0',
      message: RegulatoryOrganisationTypeMessage.NO_REGISTRATION_REFERENCE
    });
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should validate the form on clicking "Continue" and persist data and navigate to next page if validation succeeds', () => {
    spyOn(component, 'onContinue').and.callThrough();
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
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.validationErrors.length).toBe(0);
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should set the error message if regulator name is empty for a known regulator type', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.regulators = [{
      regulatorType: 'SRA',
      organisationRegistrationNumber: ''
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    const registrationNumberError = { message: RegulatoryOrganisationTypeMessage.NO_REGISTRATION_REFERENCE, id: 'organisation-registration-number0' };
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(registrationNumberError);
  });

  it('should set the error message if regulator name & number is empty for Other regulator type', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.regulators = [{
      regulatorType: 'Other',
      regulatorName: '',
      organisationRegistrationNumber: ''
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    const regulatorNameError = { message: RegulatoryOrganisationTypeMessage.NO_REGULATOR_NAME, id: 'regulator-name0' };
    const registrationNumberError = { message: RegulatoryOrganisationTypeMessage.NO_REGISTRATION_REFERENCE, id: 'organisation-registration-number0' };
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(regulatorNameError);
    expect(component.validationErrors[1]).toEqual(registrationNumberError);
  });

  it('should not set the error message if regulator type is NA', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.regulators = [{
      regulatorType: 'Not Applicable'
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set the error message if entries for regulator details are correct for SRA', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.regulators = [{
      regulatorType: 'SRA',
      organisationRegistrationNumber: '123'
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set the error message if entries for regulator are correct for Other', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.regulators = [{
      regulatorType: 'Other',
      regulatorName: 'Test',
      organisationRegistrationNumber: '123'
    }];
    component.setFormControlValues();
    fixture.detectChanges();
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set the error message if duplicate entries for regulator - SRA', () => {
    component.regulatorType = RegulatorType.Organisation;
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
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should set the duplicate error message if duplicate entries for regulator - SRA', () => {
    component.regulatorType = RegulatorType.Organisation;
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
    const duplicateError = { message: RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR_BANNER, id: 'regulator-type0' };
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(duplicateError);
  });

  it('should set the duplicate error message if duplicate entries for regulator - Other', () => {
    component.regulatorType = RegulatorType.Organisation;
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
    const duplicateError = { message: RegulatoryOrganisationTypeMessage.DUPLICATE_REGULATOR_BANNER, id: 'regulator-type0' };
    component.onContinue();
    expect(component.validationErrors[0]).toEqual(duplicateError);
  });

  it('should not set error message if duplicate entries for regulator - Other', () => {
    component.regulatorType = RegulatorType.Organisation;
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
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should not set error message if duplicate entries for regulator - Other', () => {
    component.regulatorType = RegulatorType.Organisation;
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
    component.onContinue();
    expect(component.validationErrors.length).toEqual(0);
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });

  it('should back link navigate to the individual registered with regulator page', () => {
    mockRoute.snapshot.params.backLinkTriggeredFromCYA = false;
    component.regulatorType = RegulatorType.Individual;
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'individual-registered-with-regulator']);
  });

  it('should back link navigate to the document exchange reference details page', () => {
    mockRoute.snapshot.params.backLinkTriggeredFromCYA = false;
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.hasDxReference = true;
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'document-exchange-reference-details']);
  });

  it('should back link navigate to the document exchange reference page', () => {
    mockRoute.snapshot.params.backLinkTriggeredFromCYA = false;
    component.regulatorType = RegulatorType.Organisation;
    component.registrationData.hasDxReference = false;
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'document-exchange-reference']);
  });

  it('should back link navigate to the check your answers page', () => {
    mockRoute.snapshot.params.backLinkTriggeredFromCYA = false;
    component.previousUrl = 'check-your-answers';
    component.onBack();
    expect(router.navigate).toHaveBeenCalledWith(['register-org-new', 'check-your-answers']);
  });

  describe('isSRARegulated', () => {
    it('returns true when an SRA regulator with a registration number is present', () => {
      const regulators: any[] = [
        { regulatorType: RegulatorDetailsComponent.SRA_REG_TYPE, organisationRegistrationNumber: 'SRA123' },
        { regulatorType: 'Other', regulatorName: 'Test', organisationRegistrationNumber: '999' }
      ];
      expect((component as any).isSRARegulated(regulators)).toBeTrue();
    });

    it('returns false when SRA regulator is missing or has no registration number', () => {
      const regulatorsWrongType: any[] = [
        // Note: missing "(SRA)" suffix, should be false
        { regulatorType: 'Solicitor Regulation Authority', organisationRegistrationNumber: 'SRA123' }
      ];
      const regulatorsNoNumber: any[] = [
        { regulatorType: RegulatorDetailsComponent.SRA_REG_TYPE, organisationRegistrationNumber: '' }
      ];

      expect((component as any).isSRARegulated(regulatorsWrongType)).toBeFalse();
      expect((component as any).isSRARegulated(regulatorsNoNumber)).toBeFalse();
    });
  });
});
