import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { RegistrationData } from '../../../register-org/models';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegulatoryOrganisationTypeComponent } from './regulatory-organisation-type.component';

describe('OrganisationTypeComponent', () => {
  let component: RegulatoryOrganisationTypeComponent;
  let fixture: ComponentFixture<RegulatoryOrganisationTypeComponent>;
  let mockLovRefDataService: any;
  let nativeElement: any;

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
    { name: 'Not Applicable', id: 'NA' }
  ];

  beforeEach(async () => {
    mockLovRefDataService = jasmine.createSpyObj('LovRefDataService', ['getRegulatoryOrganisationType']);
    mockLovRefDataService.getRegulatoryOrganisationType.and.returnValue(of(organisationTypes));
    await TestBed.configureTestingModule({
      declarations: [RegulatoryOrganisationTypeComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display Add another regulator button if NA is selected', () => {
    expect(nativeElement.querySelector('#other-organisation-type')).toBeDefined();
    nativeElement.querySelector('#other-organisation-type').value = 'NA';
    fixture.detectChanges();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeDefined();
    expect(nativeElement.querySelector('#organisation-registration-number')).toBeNull();
    expect(nativeElement.querySelector('#regulator-name')).toBeNull();
  });

  it('should display Add another regulator button if Other is selected', () => {
    expect(nativeElement.querySelector('#other-organisation-type')).toBeDefined();
    nativeElement.querySelector('#other-organisation-type').value = 'Other';
    fixture.detectChanges();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeDefined();
    expect(nativeElement.querySelector('#organisation-registration-number')).toBeDefined();
    expect(nativeElement.querySelector('#regulator-name')).toBeDefined();
  });

  it('should display Add another regulator button if some other value is selected', () => {
    expect(nativeElement.querySelector('#other-organisation-type')).toBeDefined();
    nativeElement.querySelector('#other-organisation-type').value = 'SRA';
    fixture.detectChanges();
    expect(nativeElement.querySelector('#add-another-regulator')).toBeDefined();
    expect(nativeElement.querySelector('#organisation-registration-number')).toBeDefined();
    expect(nativeElement.querySelector('#regulator-name')).toBeNull();
  });
});
