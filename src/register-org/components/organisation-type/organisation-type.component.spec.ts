import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegistrationData } from '../../models';
import { OrgTypeMessageEnum } from '../../models/organisation-type.enum';
import { OrganisationTypeComponent } from './organisation-type.component';

describe('OrganisationTypeComponent', () => {
  let component: OrganisationTypeComponent;
  let fixture: ComponentFixture<OrganisationTypeComponent>;
  let mockLovRefDataService: any;
  let nativeElement: any;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  const registrationData: RegistrationData = {
    pbaNumbers: [],
    companyName: '',
    hasDxReference: null,
    dxNumber: null,
    dxExchange: null,
    hasPBA: null,
    contactDetails: null,
    hasIndividualRegisteredWithRegulator: null,
    services: [],
    address: null,
    organisationType: null,
    inInternationalMode: null,
    regulatorRegisteredWith: null,
    regulators: []
  };

  const OTHER_ORGANISATION_TYPES_REF_DATA: LovRefDataModel[] = [
    {
      active_flag: 'Y',
      category_key: 'OtherOrgType',
      child_nodes: null,
      hint_text_cy: '',
      hint_text_en: '',
      key: 'AccommodationAndFood',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      value_cy: '',
      value_en: 'Accommodation & Food'
    },
    {
      active_flag: 'Y',
      category_key: 'OtherOrgType',
      child_nodes: null,
      hint_text_cy: '',
      hint_text_en: '',
      key: 'AdminAndSupport',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      value_cy: '',
      value_en: 'Admin & Support'
    },
    {
      active_flag: 'Y',
      category_key: 'OtherOrgType',
      child_nodes: null,
      hint_text_cy: '',
      hint_text_en: '',
      key: 'Education',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      value_cy: '',
      value_en: 'Education'
    }
  ];

  beforeEach(async () => {
    mockLovRefDataService = jasmine.createSpyObj('LovRefDataService', ['getListOfValues']);
    mockLovRefDataService.getListOfValues.and.returnValue(of(OTHER_ORGANISATION_TYPES_REF_DATA));
    await TestBed.configureTestingModule({
      declarations: [OrganisationTypeComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, RouterTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: LovRefDataService, useValue: mockLovRefDataService },
        { provide: Router, useValue: mockRouter }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationTypeComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    component.registrationData = registrationData;
    fixture.detectChanges();
  });

  afterEach(() => {
    component.ngOnDestroy();
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should validate the form on clicking "Continue" and persist data and navigate to next page if validation succeeds', () => {
    spyOn(component, 'onContinue').and.callThrough();
    const continueButton = nativeElement.querySelector('.govuk-button--primary');
    const firstButton = nativeElement.querySelectorAll('.govuk-radios__input').item(0);
    // select an organisation type and continue
    firstButton.click();
    fixture.detectChanges();
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.organisationTypeErrors.length).toBe(0);
    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(component.registrationData.organisationType).toBe('SolicitorOrganisation');
  });

  it('should display other organisation types dropdown when other radio option is selected', () => {
    nativeElement.querySelector('#other').click();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#other-organisation-type')).toBeDefined();
    expect(nativeElement.querySelector('#other-organisation-detail')).toBeDefined();
  });

  it('should return validation error for other org with type selected and empty details', () => {
    mockRouter.navigate.calls.reset();
    component.organisationTypeFormGroup.get('otherOrganisationDetail').setValue('');
    component.organisationTypeFormGroup.get('otherOrganisationType').setValue('Test');
    spyOn(component, 'onContinue').and.callThrough();
    nativeElement.querySelector('#other').click();
    fixture.detectChanges();
    const continueButton = nativeElement.querySelector('.govuk-button--primary');
    // select an organisation type and continue
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.organisationTypeErrors.length).toBe(1);
    expect(component.organisationTypeErrors[0]).toEqual({
      id: 'other-organisation-detail',
      message: OrgTypeMessageEnum.NO_ORG_DETAIS
    });
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should return validation error for other org with type not selected and details filled', () => {
    mockRouter.navigate.calls.reset();
    component.organisationTypeFormGroup.get('otherOrganisationDetail').setValue('Test');
    component.organisationTypeFormGroup.get('otherOrganisationType').setValue('none');
    spyOn(component, 'onContinue').and.callThrough();
    nativeElement.querySelector('#other').click();
    fixture.detectChanges();
    const continueButton = nativeElement.querySelector('.govuk-button--primary');
    // select an organisation type and continue
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.organisationTypeErrors.length).toBe(1);
    expect(component.organisationTypeErrors[0]).toEqual({
      id: 'other-organisation-type',
      message: OrgTypeMessageEnum.NO_ORG_TYPE_SELECTED
    });
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should validate the form on clicking "Continue" and persist data if validation succeeds on other', () => {
    spyOn(component, 'onContinue').and.callThrough();
    nativeElement.querySelector('#other').click();
    fixture.detectChanges();
    component.organisationTypeFormGroup.get('otherOrganisationType').setValue('example');
    component.organisationTypeFormGroup.get('otherOrganisationDetail').setValue('text');

    const continueButton = nativeElement.querySelector('.govuk-button--primary');
    // select an organisation type and continue
    continueButton.click();
    expect(component.onContinue).toHaveBeenCalled();
    expect(component.organisationTypeErrors.length).toBe(0);
    expect(mockRouter.navigate).toHaveBeenCalled();
    expect(component.registrationData.organisationType).toBe('other');
    expect(component.registrationData.otherOrganisationType).toBe('example');
    expect(component.registrationData.otherOrganisationDetail).toBe('text');
  });

  it('should back link navigate to the correct page', () => {
    spyOn(component, 'navigateToPreviousPage');
    component.onBack();
    expect(component.navigateToPreviousPage).toHaveBeenCalled();
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
