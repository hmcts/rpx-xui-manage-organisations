import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExuiCommonLibModule, User, UserAccessType } from '@hmcts/rpx-xui-common-lib';
import { OrganisationAccessPermissionsComponent } from './organisation-access-permissions.component';
import { Jurisdiction } from 'src/models';
import { ReactiveFormsModule } from '@angular/forms';
import { RpxTranslationService } from 'rpx-xui-translation';
import { CaseManagementPermissions } from '../../models/case-management-permissions.model';
import {
  StandardUserPermissionsComponent,
  SolicitorProfileContentComponent,
  OgdDwpProfileContentComponent,
  OgdHoProfileContentComponent,
  OgdHmrcProfileContentComponent,
  OgdCicaProfileContentComponent,
  OgdCafcassEnProfileContentComponent,
  OgdCafcassCyProfileContentComponent
} from '../../components';

describe('OrganisationAccessPermissionsComponent', () => {
  const knownJurisdictions:Jurisdiction[] = [
    {
      jurisdictionId: '5',
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

  const userWithCaseManagerRole: User = {
    email: 'john@doe.com',
    fullName: 'John Doe',
    accessTypes: knownExistingUserAccessType,
    roles: ['pui-case-manager']
  };

  const userWithoutCaseManagerRole: User = {
    email: 'john@doe.com',
    fullName: 'John Doe',
    accessTypes: [],
    roles: []
  };

  let component: OrganisationAccessPermissionsComponent;
  let fixture: ComponentFixture<OrganisationAccessPermissionsComponent>;
  const translationMockService = jasmine.createSpyObj('translationMockService', ['translate', 'getTranslation$']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrganisationAccessPermissionsComponent, StandardUserPermissionsComponent,
        SolicitorProfileContentComponent,
        OgdDwpProfileContentComponent,
        OgdHoProfileContentComponent,
        OgdHmrcProfileContentComponent,
        OgdCicaProfileContentComponent,
        OgdCafcassEnProfileContentComponent,
        OgdCafcassCyProfileContentComponent],
      imports: [ReactiveFormsModule, ExuiCommonLibModule],
      providers: [{ provide: RpxTranslationService, useValue: translationMockService }]
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrganisationAccessPermissionsComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  describe('User with case manager role', () => {
    beforeEach(() => {
      component.jurisdictions = knownJurisdictions;
      component.user = userWithCaseManagerRole;
    });

    it('should create', () => {
      component.ngOnInit();
      fixture.detectChanges();

      expect(component).toBeTruthy();
      expect(component.permissions).toBeTruthy();
      expect(component.jurisdictionPermissionsForm).toBeTruthy();
    });

    it('should setup permissions model from org and user models', () => {
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
      expect(component.selectedPermissionsChanged.emit).toHaveBeenCalledWith({
        manageCases: true,
        userAccessTypes: component.mapPermissionsToUserAccessTypes()
      } as CaseManagementPermissions);
    });
  });

  describe('User without case manager role', () => {
    beforeEach(() => {
      component.jurisdictions = knownJurisdictions;
      component.user = userWithoutCaseManagerRole;
    });

    it('should set up with no access types', () => {
      // arrange
      spyOn(component.selectedPermissionsChanged, 'emit');
      component.ngOnInit();
      fixture.detectChanges();

      // assert
      expect(component).toBeTruthy();
      expect(component.permissions).toBeTruthy();
      expect(component.jurisdictionPermissionsForm).toBeTruthy();
      expect(component.selectedPermissionsChanged.emit).toHaveBeenCalledWith({
        manageCases: false,
        userAccessTypes: []
      } as CaseManagementPermissions);
      const inputElement = fixture.nativeElement.querySelector('[id="4"]');
      expect(inputElement).toBeNull();
    });

    it('should display access types when case manager role is selected', () => {
      // arrange
      spyOn(component.selectedPermissionsChanged, 'emit');
      component.ngOnInit();
      fixture.detectChanges();

      // act
      const caseManageRoleCheckbox = fixture.nativeElement.querySelector('[id="enableCaseManagement"]');
      caseManageRoleCheckbox.click();
      expect(component.selectedPermissionsChanged.emit).toHaveBeenCalledWith({
        manageCases: true,
        userAccessTypes: component.mapPermissionsToUserAccessTypes()
      } as CaseManagementPermissions);
      fixture.detectChanges();
      const accessTypeCheckbox = fixture.nativeElement.querySelector('[id="4"]');
      expect(accessTypeCheckbox).not.toBeNull();
    });
  });
});
