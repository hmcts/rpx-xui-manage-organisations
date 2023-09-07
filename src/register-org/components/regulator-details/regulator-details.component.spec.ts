import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RegistrationData, RegulatorType, RegulatoryType } from '../../../register-org/models';
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
});
