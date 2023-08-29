import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RegistrationData, RegulatoryOrgTypeMessageEnum } from '../../../register-org/models';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegulatoryOrganisationTypeComponent } from './regulatory-organisation-type.component';

describe('OrganisationTypeComponent', () => {
  let component: RegulatoryOrganisationTypeComponent;
  let fixture: ComponentFixture<RegulatoryOrganisationTypeComponent>;
  let mockLovRefDataService: any;
  let nativeElement: any;
  let router: Router;

  const registrationData: RegistrationData = {
    name: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    hasPBA: null,
    contactDetails: null,
    hasRegisteredWithRegulator: null,
    services: [],
    address: null,
    organisationType: null,
    regulatoryOrgType: null,
    regulatorRegisteredWith: null
  };

  const organisationTypes = [
    { name: 'Solicitor Regulation Authority', id: 'SRA' },
    { name: 'Financial Conduct Authority', id: 'FCA' },
    { name: 'Other', id: 'Other' },
    { name: 'Not Applicable', id: 'N/A' }
  ];

  beforeEach(async () => {
    mockLovRefDataService = jasmine.createSpyObj('LovRefDataService', ['getRegulatoryOrganisationType']);
    mockLovRefDataService.getRegulatoryOrganisationType.and.returnValue(of(organisationTypes));
    await TestBed.configureTestingModule({
      declarations: [RegulatoryOrganisationTypeComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        {
          provide: LovRefDataService, useValue: mockLovRefDataService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulatoryOrganisationTypeComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.registrationData = registrationData;
    spyOn(component, 'onOptionSelected').and.callThrough();
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create component with one "regulator type" selection field displayed and nothing else', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('#regulator-type0')).toBeTruthy();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
  });

  it('should show "Add another regulator" button and "Registration number" field if a regulator type is selected', () => {
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
    const selectElement = nativeElement.querySelector('#regulator-type0');
    selectElement.value = selectElement.options[1].value;
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

  it('should show "Add" button, and "Regulator name" and "Registration number" fields if the regulator type "Other" is selected', () => {
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
    const selectElement = nativeElement.querySelector('#regulator-type0');
    selectElement.value = selectElement.options[3].value;
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

  it('should show only the "Add another regulator" button if the regulator type "N/A" is selected', () => {
    expect(nativeElement.querySelector('#add-another-regulator')).toBeFalsy();
    const selectElement = nativeElement.querySelector('#regulator-type0');
    selectElement.value = selectElement.options[4].value;
    selectElement.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.regulators.controls[0].get('regulatorType').value).toEqual('N/A');
    expect(component.onOptionSelected).toHaveBeenCalledWith('N/A', 0);
    expect(component.regulators.controls[0].get('regulatorName')).toBeFalsy();
    expect(component.regulators.controls[0].get('organisationRegistrationNumber')).toBeFalsy();
    expect(nativeElement.querySelector('#regulator-name0')).toBeFalsy();
    expect(nativeElement.querySelector('#organisation-registration-number0')).toBeFalsy();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeTruthy();
  });

  it('should add a new regulator entry when the "Add another regulator" button is clicked', () => {
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

  it('should validate the form on clicking "Continue" and not persist data or navigate to next page if validation fails', () => {
    spyOn(component, 'onContinueClicked').and.callThrough();
    spyOn(router, 'navigate');
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
    expect(component.onContinueClicked).toHaveBeenCalled();
    expect(component.validationErrors.length).toBe(2);
    expect(component.validationErrors[0]).toEqual({
      id: 'regulator-name0',
      message: RegulatoryOrgTypeMessageEnum.NO_REGULATOR_NAME
    });
    expect(component.validationErrors[1]).toEqual({
      id: 'regulator-type1',
      message: RegulatoryOrgTypeMessageEnum.NO_REGULATORY_ORG_SELECTED
    });
    expect(router.navigate).not.toHaveBeenCalled();
    // TODO Test to be amended to check for non-persistence once this has been modified to use
    // RegisterOrgService.persistRegistrationData
  });

  it('should validate the form on clicking "Continue" and persist data and navigate to next page if validation succeeds', () => {
    spyOn(component, 'onContinueClicked').and.callThrough();
    spyOn(router, 'navigate');
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    // Select the "Other" option and fill in the mandatory regulatorName field
    selectElement0.value = selectElement0.options[3].value;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    const regulatorNameElement = nativeElement.querySelector('#regulator-name0');
    regulatorNameElement.value = 'Test';
    regulatorNameElement.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    const addButton = nativeElement.querySelector('#add-another-regulator');
    addButton.click();
    fixture.detectChanges();
    const selectElement1 = nativeElement.querySelector('#regulator-type1');
    selectElement1.value = selectElement0.options[1].value;
    selectElement1.dispatchEvent(new Event('change'));
    //fixture.detectChanges();
    const continueButton = nativeElement.querySelector('.govuk-button--primary');
    continueButton.click();
    expect(component.onContinueClicked).toHaveBeenCalled();
    expect(component.validationErrors.length).toBe(0);
    expect(router.navigate).toHaveBeenCalled();
    // TODO Test to be amended to check for persistence once this has been modified to use
    // RegisterOrgService.persistRegistrationData
  });

  it('should not show a "Remove" button when there is only one regulator entry', () => {
    const selectElement0 = nativeElement.querySelector('#regulator-type0');
    selectElement0.value = selectElement0.options[1].value;
    selectElement0.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(nativeElement.querySelector('#remove-button0')).toBeFalsy();
  });

  it('should show a "Remove" button for every entry when there is more than one regulator entry', () => {
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
});
