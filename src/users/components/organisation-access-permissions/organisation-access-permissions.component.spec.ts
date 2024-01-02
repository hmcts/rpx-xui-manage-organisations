import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { OrganisationAccessPermissionsComponent } from './organisation-access-permissions.component';
import { TempJurisdicationModel } from './organisation-access-permissions.component';
import { ReactiveFormsModule } from '@angular/forms';
import { OgdProfileContentComponent, SolicitorProfileContentComponent } from 'src/users/containers';

describe('OrganisationAccessPermissionsComponent', () => {
  const knownJurisdictions:TempJurisdicationModel[] = [
    {
      jurisdictionid: '5',
      jurisdictionName: 'Family Public Law',
      accessTypes: [
        {
          organisationProfileId: 'SOLICITOR_PROFILE',
          accessTypeId: '1',
          accessMandatory: false,
          accessDefault: false,
          display: true,
          description: 'Non-mandatory access type',
          hint: 'Hint  for the BEFTA Master Jurisdiction Access Type.',
          displayOrder: 3
        },
        {
          organisationProfileId: 'SOLICITOR_PROFILE',
          accessTypeId: '2',
          accessMandatory: false,
          accessDefault: false,
          display: false,
          description: 'Non displayed access type',
          hint: 'Hint  for the BEFTA Master Jurisdiction Access Type.',
          displayOrder: 2
        },
        {
          organisationProfileId: 'SOLICITOR_PROFILE',
          accessTypeId: '3',
          accessMandatory: false,
          accessDefault: false,
          display: true,
          description: 'Access type already enabled by user',
          hint: 'Hint  for the BEFTA Master Jurisdiction Access Type.',
          displayOrder: 1
        },
        {
          organisationProfileId: 'SOLICITOR_PROFILE',
          accessTypeId: '4',
          accessMandatory: false,
          accessDefault: true,
          display: true,
          description: 'Default access type enabled',
          hint: 'Hint  for the BEFTA Master Jurisdiction Access Type.',
          displayOrder: 3
        }
      ]
    }
  ];

  const knownExistingUserAccessType:UserAccessType[] = [
    {
      jurisdictionId: '5',
      accessTypeId: '3',
      enabled: true,
      organisationProfileId: 'SOLICITOR_PROFILE'
    }

  ];

  let component: OrganisationAccessPermissionsComponent;
  let fixture: ComponentFixture<OrganisationAccessPermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisationAccessPermissionsComponent, SolicitorProfileContentComponent, OgdProfileContentComponent],
      imports: [ReactiveFormsModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrganisationAccessPermissionsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    component.ngOnInit();
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.permissions).toBeTruthy();
    expect(component.jurisdictionPermissionsForm).toBeTruthy();
  });

  it('should setup permissions model from org and user models', () => {
    // arrange
    component.jurisdictions = knownJurisdictions;
    component.userAccessTypes = knownExistingUserAccessType;

    // act
    component.ngOnInit();
    fixture.detectChanges();

    // assert
    const jurisdiction = component.permissions[0];
    // assert simple properties
    expect(jurisdiction.jurisdictionName).toBe('Family Public Law');
    expect(jurisdiction.jurisdictionId).toBe('5');
    // should filter hidden access types
    expect(jurisdiction.accessTypes.length).toBe(3);
    // check order
    expect(jurisdiction.accessTypes[0].accessTypeId).toBe('3');
    expect(jurisdiction.accessTypes[1].accessTypeId).toBe('1');
    expect(jurisdiction.accessTypes[2].accessTypeId).toBe('4');
    // check enabled
    expect(jurisdiction.accessTypes[0].enabled).toBe(true);
    expect(jurisdiction.accessTypes[1].enabled).toBe(false);
    expect(jurisdiction.accessTypes[2].enabled).toBe(true); // mandatory must be enabled
  });

  it('should emit permissions model when form is updated', () => {
    // arrange
    spyOn(component.selectedPermissionsChanged, 'emit');

    component.jurisdictions = knownJurisdictions;
    component.userAccessTypes = knownExistingUserAccessType;
    component.ngOnInit();
    fixture.detectChanges();

    // act
    const jurisdiction = component.permissions[0];
    expect(jurisdiction.accessTypes[2].accessTypeId).withContext('access type with id 4 exists').toBe('4');
    expect(jurisdiction.accessTypes[2].enabled).withContext('access type with id 4 is enabled').toBe(true);
    expect(fixture.debugElement.nativeElement.innerHTML).toContain('id="4"');
    const inputElement = fixture.nativeElement.querySelector('[id="4"]');
    inputElement.click();

    // assert
    expect(component.permissions[0].accessTypes.find((at) => at.accessTypeId === '4').enabled).toBe(false);
    expect(component.selectedPermissionsChanged.emit).toHaveBeenCalledWith(component.mapPermissionsToUserAccessTypes());
  });
});
